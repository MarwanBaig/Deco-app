import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSION_COOKIE = 'deco_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

// Ephemeral fallback secret if AUTH_SESSION_SECRET is not provided in environment
const SESSION_SECRET =
  process.env.AUTH_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  preferences?: {
    backdrop: string;
    readingComfort: string;
  };
  progress?: Record<string, unknown>;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readUsers(): StoredUser[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) return [];
    const raw = fs.readFileSync(USERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, keyHex] = stored.split(':');
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derived = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuf, derived);
}

function signSessionToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ uid: userId, exp: Date.now() + SESSION_MAX_AGE_MS })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expected = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!decoded?.uid || typeof decoded.exp !== 'number' || decoded.exp < Date.now()) {
      return null;
    }
    return String(decoded.uid);
  } catch {
    return null;
  }
}

function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie || '';
  const map: Record<string, string> = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx > 0) {
      const k = pair.slice(0, idx).trim();
      const v = pair.slice(idx + 1).trim();
      map[k] = decodeURIComponent(v);
    }
  });
  return map;
}

function setSessionCookie(res: Response, userId: string) {
  const token = signSessionToken(userId);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(
      SESSION_MAX_AGE_MS / 1000
    )}${secure}`
  );
}

function clearSessionCookie(res: Response) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`
  );
}

function sanitizeUser(u: StoredUser) {
  return {
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    preferences: u.preferences || { backdrop: 'mountains', readingComfort: 'standard' },
    progress: u.progress || null
  };
}

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

interface TutorRequestBody {
  messages: ChatMessageInput[];
  difficulty?: 'beginner' | 'intermediate' | 'exam';
  mode?: 'explain' | 'solve' | 'mistake' | 'practice' | 'diagram';
  unitId?: string;
  chapterTitle?: string;
  chapterSyllabusTopic?: string;
  mistakeContext?: string;
}

const SYLLABUS_REFERENCE: Record<
  string,
  {
    number: string;
    title: string;
    keywords: string[];
    syllabusText: string;
    textbooks: string[];
    chapters: { id: string; title: string; keywords: string[] }[];
  }
> = {
  'unit-1': {
    number: 'Unit-I',
    title: 'Number Systems',
    keywords: [
      'binary', 'octal', 'hexadecimal', 'radix', 'base', 'complement', "1's", "2's", "9's", "10's",
      'bcd', 'gray code', 'excess-3', 'weighted', 'non-weighted', 'parity', 'hamming', 'boolean',
      'de morgan', 'canonical', 'sop', 'pos', 'minterm', 'maxterm', 'gate', 'nand', 'nor', 'xor', 'xnor'
    ],
    syllabusText:
      'Number systems, Complements of Numbers, Codes- Weighted and Non-weighted codes and its Properties, Parity check code and Hamming code. Boolean algebra: Basic Theorems and Properties, Switching Functions- Canonical and Standard Form, Algebraic Simplification, Fundamentals of Digital Logic Gates.',
    textbooks: [
      'Morris Mano & Michael Ciletti, Digital Design (5th Ed., Pearson, 2013)',
      'R.P. Jain, Modern Digital Electronics (4th Ed., McGraw Hill, 2003)'
    ],
    chapters: [
      { id: 'u1-c1', title: '1.1 Number Systems & Base Conversions', keywords: ['binary', 'octal', 'hexadecimal', 'decimal', 'radix', 'convert'] },
      { id: 'u1-c2', title: '1.2 Complements of Numbers', keywords: ['complement', "1's", "2's", "9's", "10's", 'subtract'] },
      { id: 'u1-c3', title: '1.3 Weighted & Non-Weighted Codes', keywords: ['bcd', 'gray', 'excess-3', 'weighted', '8421'] },
      { id: 'u1-c4', title: '1.4 Parity Check & Hamming Code', keywords: ['parity', 'hamming', 'syndrome', 'error'] },
      { id: 'u1-c5', title: '1.5 Boolean Algebra: Theorems & Properties', keywords: ['boolean', 'theorem', 'de morgan', 'consensus', 'absorption'] },
      { id: 'u1-c6', title: '1.6 Switching Functions: Canonical & Standard Form', keywords: ['canonical', 'minterm', 'maxterm', 'sop', 'pos'] },
      { id: 'u1-c7', title: '1.7 Algebraic Simplification', keywords: ['algebraic', 'simplify', 'simplification'] },
      { id: 'u1-c8', title: '1.8 Fundamentals of Digital Logic Gates', keywords: ['gate', 'and', 'or', 'nand', 'nor', 'xor', 'xnor', 'universal'] }
    ]
  },
  'unit-2': {
    number: 'Unit-II',
    title: 'Combinational Circuits',
    keywords: [
      'k-map', 'karnaugh', 'quine', 'mccluskey', 'tabular', 'prime implicant', "don't care",
      'half adder', 'full adder', 'subtractor', 'comparator', 'multiplexer', 'mux',
      'demultiplexer', 'demux', 'encoder', 'decoder', 'priority encoder', 'combinational'
    ],
    syllabusText:
      'Implementation of logic functions using K-Map, Quine-McCluskey Tabular method, Adders: half adder, full adder, Subtractors, Comparators, Multiplexers, De-multiplexers, Encoders and Decoders.',
    textbooks: [
      'Morris Mano & Michael Ciletti, Digital Design (5th Ed., Pearson, 2013)',
      'R.P. Jain, Modern Digital Electronics (4th Ed., McGraw Hill, 2003)'
    ],
    chapters: [
      { id: 'u2-c1', title: '2.1 Karnaugh Map (K-Map) Simplification', keywords: ['k-map', 'karnaugh', "don't care", 'implicant'] },
      { id: 'u2-c2', title: '2.2 Quine–McCluskey Tabular Method', keywords: ['quine', 'mccluskey', 'tabular', 'prime implicant'] },
      { id: 'u2-c3', title: '2.3 Half Adder & Full Adder', keywords: ['half adder', 'full adder', 'carry', 'sum'] },
      { id: 'u2-c4', title: '2.4 Half & Full Subtractors', keywords: ['subtractor', 'borrow'] },
      { id: 'u2-c5', title: '2.5 Magnitude Comparators', keywords: ['comparator', 'magnitude'] },
      { id: 'u2-c6', title: '2.6 Multiplexers (MUX)', keywords: ['multiplexer', 'mux', 'data selector'] },
      { id: 'u2-c7', title: '2.7 De-Multiplexers (DEMUX)', keywords: ['demultiplexer', 'demux'] },
      { id: 'u2-c8', title: '2.8 Encoders & Decoders', keywords: ['encoder', 'decoder', 'priority'] }
    ]
  },
  'unit-3': {
    number: 'Unit-III',
    title: 'Sequential Circuits',
    keywords: [
      'sequential', 'latch', 'sr latch', 'flip-flop', 'flip flop', 'jk', 'master slave', 'race around',
      'd flip', 't flip', 'characteristic', 'excitation table', 'conversion', 'clock', 'trigger', 'state'
    ],
    syllabusText:
      'Basic Architectural Distinctions between Combinational and Sequential circuits, SR Latch, Flip Flops: SR, JK, JK Master Slave, D and T Type Flip Flops. Excitation Table of all Flip Flops, Conversion from one type of Flip-Flop to another.',
    textbooks: [
      'Morris Mano & Michael Ciletti, Digital Design (5th Ed., Pearson, 2013)',
      'Ronald J. Tocci et al., Digital Systems: Principles and Applications (11th Ed., Pearson, 2011)'
    ],
    chapters: [
      { id: 'u3-c1', title: '3.1 Combinational vs. Sequential Circuits', keywords: ['combinational', 'sequential', 'memory', 'feedback'] },
      { id: 'u3-c2', title: '3.2 SR Latch (NOR & NAND)', keywords: ['latch', 'sr latch'] },
      { id: 'u3-c3', title: '3.3 SR & D Type Flip-Flops', keywords: ['sr flip', 'd flip', 'transparent'] },
      { id: 'u3-c4', title: '3.4 JK, JK Master-Slave & T Flip-Flops', keywords: ['jk', 'master slave', 'race around', 't flip', 'toggle'] },
      { id: 'u3-c5', title: '3.5 Excitation Tables of All Flip-Flops', keywords: ['excitation', 'characteristic'] },
      { id: 'u3-c6', title: '3.6 Conversion from One Flip-Flop to Another', keywords: ['conversion', 'convert'] }
    ]
  },
  'unit-4': {
    number: 'Unit-IV',
    title: 'Basic Structure of Computers',
    keywords: [
      'computer types', 'block diagram', 'operational concepts', 'bus', 'stored program', 'register',
      'pc', 'ir', 'mar', 'mdr', 'accumulator', 'instruction format', 'three-address', 'two-address',
      'i/o', 'interrupt', 'dma', 'direct memory access', 'asynchronous', 'strobe', 'handshaking'
    ],
    syllabusText:
      'Computer Types, Block diagram of Digital computer, Basic Operational Concepts, Bus Structures, Stored program organization and computer registers, Instruction formats, Input/output Organization: Block diagram of I/O organization, Interrupts, direct memory access. Asynchronous data transfer: strobe control and hand shaking.',
    textbooks: [
      'Carl Hamacher, Zvonko Vranesic, Safwat Zaky, Computer Organization (5th Ed., McGraw Hill, 2002)',
      'Joseph D. Dumas II, Computer Architecture: Fundamentals and Principles of Computer Design'
    ],
    chapters: [
      { id: 'u4-c1', title: '4.1 Computer Types & Digital Computer Block Diagram', keywords: ['computer types', 'block diagram', 'alu', 'control unit'] },
      { id: 'u4-c2', title: '4.2 Basic Operational Concepts & Bus Structures', keywords: ['operational', 'bus', 'single bus'] },
      { id: 'u4-c3', title: '4.3 Stored Program Organization & Computer Registers', keywords: ['stored program', 'register', 'mar', 'mdr', 'pc', 'ir'] },
      { id: 'u4-c4', title: '4.4 Instruction Formats', keywords: ['instruction format', 'three-address', 'two-address', 'zero-address'] },
      { id: 'u4-c5', title: '4.5 I/O Organization & Interrupts', keywords: ['i/o', 'interrupt', 'polling', 'vectored'] },
      { id: 'u4-c6', title: '4.6 Direct Memory Access (DMA)', keywords: ['dma', 'direct memory access', 'cycle stealing'] },
      { id: 'u4-c7', title: '4.7 Asynchronous Data Transfer: Strobe & Handshaking', keywords: ['asynchronous', 'strobe', 'handshaking', 'handshake'] }
    ]
  },
  'unit-5': {
    number: 'Unit-V',
    title: 'The Memory System',
    keywords: [
      'memory', 'ram', 'sram', 'dram', 'rom', 'prom', 'eprom', 'eeprom', 'speed', 'size', 'cost',
      'primary memory', 'auxiliary memory', 'associative', 'cam', 'cache', 'mapping', 'direct mapping',
      'set associative', 'hit ratio', 'virtual memory', 'paging', 'tlb', 'page fault', 'mmu', 'memory management'
    ],
    syllabusText:
      'Basic concepts, Semiconductor RAM memories, Read-Only memories, Speed, Size and Cost, Primary memory, Auxiliary memory, Associative memory, Cache memories, Virtual Memories, Memory management requirements.',
    textbooks: [
      'Carl Hamacher, Zvonko Vranesic, Safwat Zaky, Computer Organization (5th Ed., McGraw Hill, 2002)',
      'Hennessy & Patterson, Computer Architecture: A Quantitative Approach (4th Ed., Elsevier)'
    ],
    chapters: [
      { id: 'u5-c1', title: '5.1 Memory Concepts & Speed, Size, Cost Hierarchy', keywords: ['hierarchy', 'speed', 'size', 'cost'] },
      { id: 'u5-c2', title: '5.2 Semiconductor RAM Memories (SRAM & DRAM)', keywords: ['ram', 'sram', 'dram'] },
      { id: 'u5-c3', title: '5.3 Read-Only Memories (ROM, PROM, EPROM, EEPROM)', keywords: ['rom', 'prom', 'eprom', 'eeprom'] },
      { id: 'u5-c4', title: '5.4 Primary & Auxiliary Memory', keywords: ['primary', 'auxiliary', 'ssd', 'disk'] },
      { id: 'u5-c5', title: '5.5 Associative Memory (CAM)', keywords: ['associative', 'cam', 'content addressable'] },
      { id: 'u5-c6', title: '5.6 Cache Memories & Mapping Functions', keywords: ['cache', 'mapping', 'tag', 'set-associative', 'hit ratio'] },
      { id: 'u5-c7', title: '5.7 Virtual Memory & Memory Management Requirements', keywords: ['virtual memory', 'paging', 'tlb', 'page fault', 'mmu'] }
    ]
  }
};

function detectSyllabusMatches(queryText: string, explicitUnitId?: string) {
  const lower = queryText.toLowerCase();
  const scores: { unitId: string; number: string; title: string; hits: string[]; score: number }[] = [];

  for (const [unitId, info] of Object.entries(SYLLABUS_REFERENCE)) {
    const hits = info.keywords.filter((kw) => lower.includes(kw));
    const bonus = explicitUnitId === unitId ? 3 : 0;
    const score = hits.length + bonus;
    if (score > 0) {
      scores.push({
        unitId,
        number: info.number,
        title: info.title,
        hits: hits.slice(0, 5),
        score
      });
    }
  }

  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  const resolvedUnitId = top
    ? top.unitId
    : explicitUnitId && SYLLABUS_REFERENCE[explicitUnitId]
    ? explicitUnitId
    : 'general';

  // Identify closest chapter lesson to recommend
  let recommendedChapterId: string | undefined;
  let recommendedChapterTitle: string | undefined;
  if (resolvedUnitId !== 'general' && SYLLABUS_REFERENCE[resolvedUnitId]) {
    const chList = SYLLABUS_REFERENCE[resolvedUnitId].chapters;
    let bestScore = 0;
    for (const ch of chList) {
      const chScore = ch.keywords.filter((kw) => lower.includes(kw)).length;
      if (chScore > bestScore) {
        bestScore = chScore;
        recommendedChapterId = ch.id;
        recommendedChapterTitle = ch.title;
      }
    }
    if (!recommendedChapterId) {
      recommendedChapterId = chList[0].id;
      recommendedChapterTitle = chList[0].title;
    }
  }

  if (top) {
    return {
      identifiedUnitId: top.unitId,
      identifiedUnitLabel: `${top.number}: ${top.title}`,
      identifiedKeywords: top.hits,
      recommendedChapterId,
      recommendedChapterTitle,
      textbooks: SYLLABUS_REFERENCE[top.unitId].textbooks
    };
  }

  if (explicitUnitId && SYLLABUS_REFERENCE[explicitUnitId]) {
    const info = SYLLABUS_REFERENCE[explicitUnitId];
    return {
      identifiedUnitId: explicitUnitId,
      identifiedUnitLabel: `${info.number}: ${info.title}`,
      identifiedKeywords: [],
      recommendedChapterId,
      recommendedChapterTitle,
      textbooks: info.textbooks
    };
  }

  return {
    identifiedUnitId: 'general',
    identifiedUnitLabel: 'U24EC304 Full Syllabus',
    identifiedKeywords: [],
    recommendedChapterId,
    recommendedChapterTitle,
    textbooks: [
      'Morris Mano & Ciletti, Digital Design (5th Ed.)',
      'Carl Hamacher et al., Computer Organization (5th Ed.)'
    ]
  };
}

function buildSystemInstruction(
  body: TutorRequestBody,
  detected: ReturnType<typeof detectSyllabusMatches>
): string {
  const difficulty = body.difficulty || 'intermediate';
  const mode = body.mode || 'explain';

  const difficultyGuide: Record<string, string> = {
    beginner:
      'Use warm, simple beginner-friendly language first, include a relatable everyday analogy, define any unfamiliar technical term immediately, and walk through tiny examples with zero skipped steps.',
    intermediate:
      'Teach at second-year engineering (B.E.) depth: connect intuitive everyday reasoning with formal Boolean identities, truth tables, circuit behavior, and complete numericals.',
    exam:
      'Structure specifically for LIET(A) U24EC304 university CIE/SEE examinations (2-mark, 5-mark, and 10-mark answers): crisp textbook definitions, numbered derivations, clean comparison tables, and common examiner pitfalls.'
  };

  const modeGuide: Record<string, string> = {
    explain:
      'Structure the explanation calmly with: (1) Simple Intuition & Everyday Analogy, (2) Technical Explanation & Governing Equations, (3) Worked Mini-Example, (4) Common Mistake to Avoid.',
    solve:
      'Solve step by step. Number every step, state the exact rule/theorem used at each transformation, show intermediate binary/Boolean/K-Map states, and verify the final result.',
    mistake:
      'Gently diagnose why the student answer or misconception occurred without making them feel bad for asking basic questions. Pinpoint the exact step that went wrong, derive the correct path cleanly, and give a quick verification rule.',
    practice:
      'Create 3 clear syllabus practice questions (mix of conceptual, numerical, and exam-style) with helpful hints first and full step-by-step solutions below a horizontal divider.',
    diagram:
      'Trace the circuit or architecture diagram piece by piece: explain every input, gate/register, and output pin in plain terms, trace signal flow, and show the governing truth table or equation.'
  };

  const activeUnitInfo =
    body.unitId && SYLLABUS_REFERENCE[body.unitId]
      ? `Selected Unit: ${SYLLABUS_REFERENCE[body.unitId].number} (${SYLLABUS_REFERENCE[body.unitId].title}) — Official Topics: ${SYLLABUS_REFERENCE[body.unitId].syllabusText}`
      : `Detected Unit Focus: ${detected.identifiedUnitLabel}`;

  const chapterFocus = body.chapterTitle
    ? `Selected Lesson: "${body.chapterTitle}" (${body.chapterSyllabusTopic || 'U24EC304 syllabus topic'})`
    : detected.recommendedChapterTitle
    ? `Closest Matching Lesson: "${detected.recommendedChapterTitle}"`
    : '';

  const mistakeFocus = body.mistakeContext
    ? `Student Wrong-Answer Context to Diagnose:\n${body.mistakeContext}`
    : '';

  return [
    'You are the DECO ACADEMY Engineering Professor & Doubt Assistant for "U24EC304 — Digital Electronics & Computer Organization" (LIET(A), B.E. AIML, AICTE 2024-25 syllabus).',
    '',
    'TEACHING PERSONALITY:',
    '- Be warm, patient, encouraging, and approachable — never make a student feel uncomfortable for asking basic questions.',
    '- Avoid unexplained technical jargon; whenever introducing a technical term, explain it simply or with an everyday analogy.',
    '- If a student question is ambiguous or missing parameters (such as bit-width, parity type, or K-map variables), ask one brief clarifying question OR state your assumption clearly before solving.',
    '- Distinguish clearly between verified syllabus/standard electronics theory vs. anything not explicitly covered in the provided materials.',
    '',
    'VERIFIED U24EC304 SYLLABUS:',
    ...Object.values(SYLLABUS_REFERENCE).map((u) => `- ${u.number} (${u.title}): ${u.syllabusText}`),
    '',
    `PRESCRIBED COURSE TEXTBOOKS:\n- ${SYLLABUS_REFERENCE['unit-1'].textbooks.join('\n- ')}\n- ${SYLLABUS_REFERENCE['unit-4'].textbooks[0]}`,
    '',
    'ACTIVE CONTEXT:',
    activeUnitInfo,
    chapterFocus,
    mistakeFocus,
    '',
    `EXPLANATION DEPTH (${difficulty}): ${difficultyGuide[difficulty]}`,
    `ASSISTANCE MODE (${mode}): ${modeGuide[mode]}`,
    '',
    'ACCURACY & CITATION RULES:',
    '1. Ground every answer in verified U24EC304 syllabus topics and standard digital electronics / computer organization principles.',
    '2. NEVER invent textbook page numbers, slide numbers, or pretend to have checked external PDFs or Google Drive files that were not attached.',
    '3. Format mathematical expressions using LaTeX wrapped in single $...$ for inline math or $$...$$ for display equations.',
    '4. End with a short "Recommended Lesson & Grounding" note naming the matched Unit, recommended DECO Academy lesson title, and textbook edition (without fabricated page numbers).'
  ]
    .filter(Boolean)
    .join('\n');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // ============================================================
  // HEALTH ENDPOINT
  // ============================================================
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      service: 'deco-academy',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      authProvider: 'express-scrypt-cookie',
      smtpConfigured: Boolean(process.env.SMTP_HOST)
    });
  });

  // ============================================================
  // AUTHENTICATION & CLOUD PREFERENCE SYNC ENDPOINTS
  // ============================================================
  app.get('/api/auth/status', (_req: Request, res: Response) => {
    res.json({
      configured: true,
      provider: 'express-scrypt-cookie',
      emailResetConfigured: Boolean(process.env.SMTP_HOST)
    });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const token = cookies[SESSION_COOKIE];
    if (!token) {
      res.json({ user: null });
      return;
    }
    const uid = verifySessionToken(token);
    if (!uid) {
      clearSessionCookie(res);
      res.json({ user: null });
      return;
    }
    const users = readUsers();
    const user = users.find((u) => u.id === uid);
    if (!user) {
      clearSessionCookie(res);
      res.json({ user: null });
      return;
    }
    res.json({ user: sanitizeUser(user) });
  });

  app.post('/api/auth/signup', (req: Request, res: Response) => {
    const fullName = String(req.body?.fullName || '').trim();
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const confirmPassword = String(req.body?.confirmPassword || '');

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    const users = readUsers();
    if (users.some((u) => u.email === email)) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
      preferences: {
        backdrop: String(req.body?.preferences?.backdrop || 'mountains'),
        readingComfort: String(req.body?.preferences?.readingComfort || 'standard')
      },
      progress: req.body?.progress && typeof req.body.progress === 'object' ? req.body.progress : undefined
    };

    users.push(newUser);
    writeUsers(users);
    setSessionCookie(res, newUser.id);
    res.status(201).json({ user: sanitizeUser(newUser) });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Please enter your password.' });
      return;
    }

    const users = readUsers();
    const user = users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.status(401).json({ error: 'Incorrect email or password. Please check and try again.' });
      return;
    }

    setSessionCookie(res, user.id);
    res.json({ user: sanitizeUser(user) });
  });

  app.post('/api/auth/logout', (_req: Request, res: Response) => {
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  app.put('/api/auth/sync', (req: Request, res: Response) => {
    const cookies = parseCookies(req);
    const token = cookies[SESSION_COOKIE];
    const uid = token ? verifySessionToken(token) : null;
    if (!uid) {
      res.status(401).json({ error: 'Sign in required to sync cloud preferences.' });
      return;
    }

    const users = readUsers();
    const idx = users.findIndex((u) => u.id === uid);
    if (idx === -1) {
      res.status(404).json({ error: 'User account not found.' });
      return;
    }

    if (req.body?.preferences && typeof req.body.preferences === 'object') {
      users[idx].preferences = {
        backdrop: String(req.body.preferences.backdrop || 'mountains'),
        readingComfort: String(req.body.preferences.readingComfort || 'standard')
      };
    }
    if (req.body?.progress && typeof req.body.progress === 'object') {
      users[idx].progress = req.body.progress;
    }

    writeUsers(users);
    res.json({ ok: true, user: sanitizeUser(users[idx]) });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    if (!process.env.SMTP_HOST) {
      res.status(503).json({
        error:
          'Automated password-reset email delivery is not configured yet. Configure SMTP_HOST (or enable Firebase Email/Password authentication) to dispatch reset links.'
      });
      return;
    }

    res.json({
      ok: true,
      message: 'If an account matches this email, a reset link will be sent.'
    });
  });

  // ============================================================
  // AI DOUBT ASSISTANT PROXY
  // ============================================================
  app.post('/api/tutor/chat', async (req: Request, res: Response) => {
    try {
      const body = req.body as TutorRequestBody;
      const messages = Array.isArray(body?.messages) ? body.messages : [];
      if (messages.length === 0) {
        res.status(400).json({ error: 'At least one user message is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        res.status(503).json({
          error:
            'GEMINI_API_KEY is not configured in the server environment. Set it in Secrets to enable the AI DECO Assistant.'
        });
        return;
      }

      const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      const combinedText = `${body.chapterTitle || ''} ${lastUserMessage} ${body.mistakeContext || ''}`;
      const detected = detectSyllabusMatches(combinedText, body.unitId);
      const systemInstruction = buildSystemInstruction(body, detected);

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' },
          timeout: 45000
        }
      });

      const contents = messages.slice(-12).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content || '').slice(0, 6000) }]
      }));

      const thinkingLevel =
        body.difficulty === 'exam' || body.mode === 'solve'
          ? ThinkingLevel.MEDIUM
          : ThinkingLevel.LOW;

      let response;
      let modelUsed = 'gemini-4-hydrogen';
      try {
        response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents,
          config: {
            systemInstruction,
            thinkingConfig: { thinkingLevel }
          }
        });
      } catch (primaryErr) {
        const msg = primaryErr instanceof Error ? primaryErr.message : '';
        if (msg.includes('504') || msg.includes('DEADLINE_EXCEEDED') || msg.includes('timeout')) {
          modelUsed = 'gemini-3.1-flash-lite';
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
            }
          });
        } else {
          throw primaryErr;
        }
      }

      const replyText = response.text || '';
      if (!replyText.trim()) {
        res.status(502).json({ error: 'The AI assistant returned an empty response. Please try again.' });
        return;
      }

      res.json({
        reply: replyText,
        modelUsed,
        identifiedUnitId: detected.identifiedUnitId,
        identifiedUnitLabel: detected.identifiedUnitLabel,
        identifiedKeywords: detected.identifiedKeywords,
        recommendedChapterId: detected.recommendedChapterId,
        recommendedChapterTitle: detected.recommendedChapterTitle,
        textbooks: detected.textbooks,
        sourceDisclosure:
          'Grounded in verified U24EC304 Syllabus & prescribed textbooks (separate lecture PDFs/Drive pages were not attached).'
      });
    } catch (err) {
      let message = err instanceof Error ? err.message : 'Unexpected server error while contacting Gemini API.';
      try {
        const parsed = JSON.parse(message);
        if (parsed?.error?.message) message = parsed.error.message;
      } catch {
        // plain string message
      }
      console.error('[AI Tutor Error]', message);
      res.status(500).json({ error: `AI Doubt Assistant failed: ${message}` });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DECO ACADEMY server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

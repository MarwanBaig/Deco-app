export interface TruthTableResult {
  variables: string[];
  rows: { inputs: Record<string, 0 | 1>; intermediate: Record<string, 0 | 1>; output: 0 | 1 }[];
  intermediateExprs: string[];
  minterms: number[];
  maxterms: number[];
  canonicalSop: string;
  canonicalPos: string;
  error?: string;
}

type Token =
  | { type: 'VAR'; value: string }
  | { type: 'CONST'; value: 0 | 1 }
  | { type: 'OP'; value: 'NOT' | 'AND' | 'XOR' | 'OR' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' };

interface AstNode {
  kind: 'VAR' | 'CONST' | 'NOT' | 'AND' | 'XOR' | 'OR';
  label: string;
  varName?: string;
  constVal?: 0 | 1;
  left?: AstNode;
  right?: AstNode;
}

function tokenizeBoolean(raw: string): Token[] {
  const s = raw
    .replace(/\s+/g, '')
    .replace(/⊕/g, '^')
    .replace(/·/g, '*')
    .replace(/×/g, '*')
    .replace(/\./g, '*')
    .replace(/&/g, '*')
    .replace(/\|/g, '+')
    .replace(/!/g, '~')
    .replace(/’/g, "'");

  if (!s) throw new Error('Enter a Boolean expression, e.g. A·B + A\'·C');

  const rawTokens: Token[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (/[a-dA-D]/.test(ch)) {
      rawTokens.push({ type: 'VAR', value: ch.toUpperCase() });
    } else if (ch === '0' || ch === '1') {
      rawTokens.push({ type: 'CONST', value: ch === '1' ? 1 : 0 });
    } else if (ch === '~') {
      rawTokens.push({ type: 'OP', value: 'NOT' });
    } else if (ch === "'") {
      // Postfix prime operator binds to previous VAR, CONST, or RPAREN
      const prev = rawTokens[rawTokens.length - 1];
      if (!prev || (prev.type !== 'VAR' && prev.type !== 'CONST' && prev.type !== 'RPAREN')) {
        throw new Error("Invalid placement of complement (') operator.");
      }
      // Wrap previous operand or group by inserting prefix NOT before matching atom/group
      if (prev.type === 'VAR' || prev.type === 'CONST') {
        const atom = rawTokens.pop()!;
        rawTokens.push({ type: 'OP', value: 'NOT' }, atom);
      } else {
        // Scan back to matching LPAREN
        let depth = 0;
        let idx = rawTokens.length - 1;
        for (; idx >= 0; idx--) {
          if (rawTokens[idx].type === 'RPAREN') depth++;
          else if (rawTokens[idx].type === 'LPAREN') {
            depth--;
            if (depth === 0) break;
          }
        }
        if (idx < 0) throw new Error('Mismatched parentheses before prime (\').');
        rawTokens.splice(idx, 0, { type: 'OP', value: 'NOT' });
      }
    } else if (ch === '*') {
      rawTokens.push({ type: 'OP', value: 'AND' });
    } else if (ch === '^') {
      rawTokens.push({ type: 'OP', value: 'XOR' });
    } else if (ch === '+') {
      rawTokens.push({ type: 'OP', value: 'OR' });
    } else if (ch === '(') {
      rawTokens.push({ type: 'LPAREN' });
    } else if (ch === ')') {
      rawTokens.push({ type: 'RPAREN' });
    } else {
      throw new Error(`Unsupported symbol "${ch}". Use variables A–D, 0, 1, +, · (or &/*), ', ~, ^, and parentheses.`);
    }
  }

  // Insert implicit AND where adjacent atoms/groups touch (e.g. AB, A(B+C), (A)(B), ~AB? wait ~ is prefix NOT, not value)
  const out: Token[] = [];
  for (let i = 0; i < rawTokens.length; i++) {
    const curr = rawTokens[i];
    const prev = out[out.length - 1];
    if (prev) {
      const prevIsVal = prev.type === 'VAR' || prev.type === 'CONST' || prev.type === 'RPAREN';
      const currStartsVal =
        curr.type === 'VAR' ||
        curr.type === 'CONST' ||
        curr.type === 'LPAREN' ||
        (curr.type === 'OP' && curr.value === 'NOT');
      if (prevIsVal && currStartsVal) {
        out.push({ type: 'OP', value: 'AND' });
      }
    }
    out.push(curr);
  }
  return out;
}

function parseBooleanAst(tokens: Token[]): AstNode {
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseOr(): AstNode {
    let node = parseXor();
    while (peek()?.type === 'OP' && (peek() as { type: 'OP'; value: string }).value === 'OR') {
      consume();
      const right = parseXor();
      node = { kind: 'OR', label: `(${node.label} + ${right.label})`, left: node, right };
    }
    return node;
  }

  function parseXor(): AstNode {
    let node = parseAnd();
    while (peek()?.type === 'OP' && (peek() as { type: 'OP'; value: string }).value === 'XOR') {
      consume();
      const right = parseAnd();
      node = { kind: 'XOR', label: `(${node.label} ⊕ ${right.label})`, left: node, right };
    }
    return node;
  }

  function parseAnd(): AstNode {
    let node = parseUnary();
    while (peek()?.type === 'OP' && (peek() as { type: 'OP'; value: string }).value === 'AND') {
      consume();
      const right = parseUnary();
      node = { kind: 'AND', label: `${node.label}·${right.label}`, left: node, right };
    }
    return node;
  }

  function parseUnary(): AstNode {
    if (peek()?.type === 'OP' && (peek() as { type: 'OP'; value: string }).value === 'NOT') {
      consume();
      const child = parseUnary();
      const base = child.kind === 'VAR' || child.kind === 'CONST' ? `${child.label}'` : `(${child.label})'`;
      return { kind: 'NOT', label: base, left: child };
    }
    return parsePrimary();
  }

  function parsePrimary(): AstNode {
    const t = peek();
    if (!t) throw new Error('Unexpected end of Boolean expression.');
    if (t.type === 'VAR') {
      consume();
      return { kind: 'VAR', label: t.value, varName: t.value };
    }
    if (t.type === 'CONST') {
      consume();
      return { kind: 'CONST', label: String(t.value), constVal: t.value };
    }
    if (t.type === 'LPAREN') {
      consume();
      const inner = parseOr();
      if (peek()?.type !== 'RPAREN') throw new Error('Missing closing parenthesis ")".');
      consume();
      return inner;
    }
    throw new Error('Unexpected operator or token in expression.');
  }

  const ast = parseOr();
  if (pos < tokens.length) throw new Error('Unexpected trailing tokens in expression.');
  return ast;
}

function collectSubExprs(node: AstNode, set: Set<string>) {
  if (node.kind === 'VAR' || node.kind === 'CONST') return;
  if (node.left) collectSubExprs(node.left, set);
  if (node.right) collectSubExprs(node.right, set);
  set.add(node.label);
}

function evalAst(
  node: AstNode,
  env: Record<string, 0 | 1>,
  intermediate: Record<string, 0 | 1>
): 0 | 1 {
  let val: 0 | 1 = 0;
  switch (node.kind) {
    case 'VAR':
      val = env[node.varName!] ?? 0;
      return val;
    case 'CONST':
      return node.constVal!;
    case 'NOT':
      val = evalAst(node.left!, env, intermediate) ? 0 : 1;
      break;
    case 'AND':
      val = (evalAst(node.left!, env, intermediate) & evalAst(node.right!, env, intermediate)) ? 1 : 0;
      break;
    case 'XOR':
      val = (evalAst(node.left!, env, intermediate) ^ evalAst(node.right!, env, intermediate)) ? 1 : 0;
      break;
    case 'OR':
      val = (evalAst(node.left!, env, intermediate) | evalAst(node.right!, env, intermediate)) ? 1 : 0;
      break;
  }
  intermediate[node.label] = val;
  return val;
}

function extractVariables(tokens: Token[]): string[] {
  const vars = new Set<string>();
  tokens.forEach((t) => {
    if (t.type === 'VAR') vars.add(t.value);
  });
  const sorted = Array.from(vars).sort();
  return sorted.length > 0 ? sorted : ['A', 'B'];
}

export function generateTruthTable(rawExpr: string, forcedVars?: string[]): TruthTableResult {
  try {
    const tokens = tokenizeBoolean(rawExpr);
    const ast = parseBooleanAst(tokens);
    const variables = forcedVars && forcedVars.length > 0 ? forcedVars : extractVariables(tokens);
    const subSet = new Set<string>();
    collectSubExprs(ast, subSet);
    const allSubs = Array.from(subSet);
    // Keep up to 4 most helpful intermediate steps (excluding exact root if trivial)
    const intermediateExprs = allSubs.slice(0, Math.max(0, allSubs.length - 1)).slice(-4);

    const rowCount = 1 << variables.length;
    const rows: TruthTableResult['rows'] = [];
    const minterms: number[] = [];
    const maxterms: number[] = [];

    for (let i = 0; i < rowCount; i++) {
      const inputs: Record<string, 0 | 1> = {};
      variables.forEach((v, idx) => {
        const bit = (i >> (variables.length - 1 - idx)) & 1;
        inputs[v] = bit ? 1 : 0;
      });
      const intermediate: Record<string, 0 | 1> = {};
      const output = evalAst(ast, inputs, intermediate);
      rows.push({ inputs, intermediate, output });
      if (output === 1) minterms.push(i);
      else maxterms.push(i);
    }

    const sopTerms = minterms.map((m) =>
      variables
        .map((v, idx) => (((m >> (variables.length - 1 - idx)) & 1) === 1 ? v : `${v}'`))
        .join('')
    );
    const posTerms = maxterms.map(
      (m) =>
        '(' +
        variables
          .map((v, idx) => (((m >> (variables.length - 1 - idx)) & 1) === 0 ? v : `${v}'`))
          .join(' + ') +
        ')'
    );

    return {
      variables,
      rows,
      intermediateExprs,
      minterms,
      maxterms,
      canonicalSop: sopTerms.length > 0 ? sopTerms.join(' + ') : '0',
      canonicalPos: posTerms.length > 0 ? posTerms.join('·') : '1'
    };
  } catch (err) {
    return {
      variables: ['A', 'B'],
      rows: [],
      intermediateExprs: [],
      minterms: [],
      maxterms: [],
      canonicalSop: '0',
      canonicalPos: '1',
      error: err instanceof Error ? err.message : 'Invalid Boolean expression'
    };
  }
}

export function checkBooleanEquivalence(
  exprA: string,
  exprB: string
): { equivalent: boolean; error?: string; literalCountA: number; literalCountB: number; mismatchRow?: string } {
  const tokVarsA = (() => {
    try {
      return extractVariables(tokenizeBoolean(exprA));
    } catch {
      return [];
    }
  })();
  const tokVarsB = (() => {
    try {
      return extractVariables(tokenizeBoolean(exprB));
    } catch {
      return [];
    }
  })();
  const allVars = Array.from(new Set([...tokVarsA, ...tokVarsB])).sort();
  const vars = allVars.length > 0 ? allVars : ['A', 'B'];

  const tA = generateTruthTable(exprA, vars);
  if (tA.error) return { equivalent: false, error: `Expression 1: ${tA.error}`, literalCountA: 0, literalCountB: 0 };
  const tB = generateTruthTable(exprB, vars);
  if (tB.error) return { equivalent: false, error: `Your Answer: ${tB.error}`, literalCountA: 0, literalCountB: 0 };

  const countLiterals = (s: string) => (s.match(/[a-dA-D]/g) || []).length;

  for (let i = 0; i < tA.rows.length; i++) {
    if (tA.rows[i].output !== tB.rows[i].output) {
      const assignment = vars.map((v) => `${v}=${tA.rows[i].inputs[v]}`).join(', ');
      return {
        equivalent: false,
        literalCountA: countLiterals(exprA),
        literalCountB: countLiterals(exprB),
        mismatchRow: `Mismatch at ${assignment}: Expected ${tA.rows[i].output}, got ${tB.rows[i].output}`
      };
    }
  }

  return {
    equivalent: true,
    literalCountA: countLiterals(exprA),
    literalCountB: countLiterals(exprB)
  };
}

// ============================================================
// QUINE–McCLUSKEY & K-MAP EXACT SIMPLIFIER (2, 3, 4 VARIABLES)
// ============================================================

export interface PrimeImplicantGroup {
  pattern: string;
  term: string;
  covered: number[];
  isEssential: boolean;
  color: string;
}

export interface KMapSolveResult {
  expression: string;
  groups: PrimeImplicantGroup[];
  steps: string[];
}

const GROUP_COLORS = [
  '#0EA5E9', // sky
  '#10B981', // emerald
  '#F59E0B', // amber
  '#A855F7', // purple
  '#EC4899', // pink
  '#14B8A6' // teal
];

function countOnes(bin: string): number {
  return bin.split('').filter((c) => c === '1').length;
}

function combinePatterns(a: string, b: string): string | null {
  let diff = 0;
  let res = '';
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      res += a[i];
    } else if (a[i] !== '-' && b[i] !== '-') {
      diff++;
      res += '-';
    } else {
      return null;
    }
  }
  return diff === 1 ? res : null;
}

function patternCovers(pattern: string, minterm: number, numVars: number): boolean {
  const bin = minterm.toString(2).padStart(numVars, '0');
  for (let i = 0; i < numVars; i++) {
    if (pattern[i] !== '-' && pattern[i] !== bin[i]) return false;
  }
  return true;
}

function patternToAlgebra(pattern: string, vars: string[], isPos: boolean): string {
  const parts: string[] = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '-') continue;
    if (!isPos) {
      parts.push(pattern[i] === '1' ? vars[i] : `${vars[i]}'`);
    } else {
      parts.push(pattern[i] === '0' ? vars[i] : `${vars[i]}'`);
    }
  }
  if (parts.length === 0) return isPos ? '0' : '1';
  return isPos ? `(${parts.join(' + ')})` : parts.join('');
}

export function solveKMap(
  numVars: 2 | 3 | 4,
  cellValues: Record<number, 0 | 1 | 'X'>,
  mode: 'SOP' | 'POS' = 'SOP'
): KMapSolveResult {
  const vars = ['A', 'B', 'C', 'D'].slice(0, numVars);
  const totalCells = 1 << numVars;
  const targetVal = mode === 'SOP' ? 1 : 0;

  const required: number[] = [];
  const dontCares: number[] = [];
  for (let i = 0; i < totalCells; i++) {
    const v = cellValues[i] ?? 0;
    if (v === targetVal) required.push(i);
    else if (v === 'X') dontCares.push(i);
  }

  if (required.length === 0) {
    return {
      expression: mode === 'SOP' ? '0' : '1',
      groups: [],
      steps: [`All target cells (${mode === 'SOP' ? '1s' : '0s'}) are empty → Constant ${mode === 'SOP' ? '0' : '1'}.`]
    };
  }

  const allOn = [...required, ...dontCares];
  if (allOn.length === totalCells) {
    return {
      expression: mode === 'SOP' ? '1' : '0',
      groups: [
        {
          pattern: '-'.repeat(numVars),
          term: mode === 'SOP' ? '1' : '0',
          covered: required,
          isEssential: true,
          color: GROUP_COLORS[0]
        }
      ],
      steps: [`All ${totalCells} cells can be grouped into one full-map implicant → Constant ${mode === 'SOP' ? '1' : '0'}.`]
    };
  }

  const steps: string[] = [];
  let currentMap = new Map<string, number[]>();
  allOn.forEach((m) => {
    const bin = m.toString(2).padStart(numVars, '0');
    currentMap.set(bin, [m]);
  });

  const primePatterns = new Set<string>();
  let round = 1;

  while (currentMap.size > 0) {
    const buckets: string[][] = Array.from({ length: numVars + 1 }, () => []);
    for (const pat of currentMap.keys()) {
      buckets[countOnes(pat)].push(pat);
    }

    const used = new Set<string>();
    const nextMap = new Map<string, number[]>();

    for (let w = 0; w < numVars; w++) {
      for (const p1 of buckets[w]) {
        for (const p2 of buckets[w + 1]) {
          const merged = combinePatterns(p1, p2);
          if (merged) {
            used.add(p1);
            used.add(p2);
            const mins = Array.from(new Set([...(currentMap.get(p1) || []), ...(currentMap.get(p2) || [])]));
            nextMap.set(merged, mins);
          }
        }
      }
    }

    for (const pat of currentMap.keys()) {
      if (!used.has(pat)) primePatterns.add(pat);
    }

    if (nextMap.size > 0) {
      steps.push(`Merge Round ${round}: Combined ${currentMap.size} terms into ${nextMap.size} larger implicant(s).`);
    }
    currentMap = nextMap;
    round++;
  }

  // Keep only prime implicants covering at least one required cell
  const pis = Array.from(primePatterns)
    .map((pattern) => {
      const coveredAll = allOn.filter((m) => patternCovers(pattern, m, numVars));
      const coveredReq = required.filter((m) => patternCovers(pattern, m, numVars));
      return { pattern, coveredAll, coveredReq };
    })
    .filter((pi) => pi.coveredReq.length > 0);

  // Essential Prime Implicants
  const selected = new Set<string>();
  const uncovered = new Set<number>(required);

  for (const m of required) {
    const covering = pis.filter((pi) => pi.coveredReq.includes(m));
    if (covering.length === 1) {
      selected.add(covering[0].pattern);
    }
  }

  selected.forEach((pat) => {
    const pi = pis.find((p) => p.pattern === pat)!;
    pi.coveredReq.forEach((m) => uncovered.delete(m));
  });

  if (selected.size > 0) {
    steps.push(
      `Essential Prime Implicants: ${Array.from(selected)
        .map((p) => patternToAlgebra(p, vars, mode === 'POS'))
        .join(', ')}`
    );
  }

  // Greedy cover for any remaining uncovered required cells (favoring largest group / fewest literals)
  const remainingPis = pis
    .filter((pi) => !selected.has(pi.pattern))
    .sort((a, b) => b.coveredAll.length - a.coveredAll.length);

  while (uncovered.size > 0) {
    let bestPi: (typeof pis)[number] | null = null;
    let bestHit = -1;
    for (const pi of remainingPis) {
      if (selected.has(pi.pattern)) continue;
      const hits = pi.coveredReq.filter((m) => uncovered.has(m)).length;
      if (hits > bestHit) {
        bestHit = hits;
        bestPi = pi;
      }
    }
    if (!bestPi || bestHit <= 0) break;
    selected.add(bestPi.pattern);
    bestPi.coveredReq.forEach((m) => uncovered.delete(m));
  }

  const finalGroups: PrimeImplicantGroup[] = Array.from(selected).map((pattern, idx) => {
    const pi = pis.find((p) => p.pattern === pattern)!;
    const isEssential = required.some(
      (m) => pi.coveredReq.includes(m) && pis.filter((x) => x.coveredReq.includes(m)).length === 1
    );
    return {
      pattern,
      term: patternToAlgebra(pattern, vars, mode === 'POS'),
      covered: pi.coveredAll,
      isEssential,
      color: GROUP_COLORS[idx % GROUP_COLORS.length]
    };
  });

  const expression =
    mode === 'SOP'
      ? finalGroups.map((g) => g.term).join(' + ')
      : finalGroups.map((g) => g.term).join('·');

  steps.push(`Final Minimized ${mode}: F = ${expression}`);

  return { expression, groups: finalGroups, steps };
}

// ============================================================
// STEP-BY-STEP NUMBER SYSTEM CONVERSION HELPERS
// ============================================================

export interface DivisionStep {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: string;
}

export function getRepeatedDivisionSteps(n: number, base: number): DivisionStep[] {
  if (n === 0) return [{ dividend: 0, divisor: base, quotient: 0, remainder: '0' }];
  const steps: DivisionStep[] = [];
  let cur = n;
  while (cur > 0) {
    const q = Math.floor(cur / base);
    const rem = cur % base;
    steps.push({
      dividend: cur,
      divisor: base,
      quotient: q,
      remainder: rem.toString(base).toUpperCase()
    });
    cur = q;
  }
  return steps;
}

export function parseRadixInput(raw: string, base: 2 | 8 | 10 | 16): { value: number | null; error?: string } {
  const clean = raw.trim().toUpperCase().replace(/^0X/, '');
  if (!clean) return { value: 0 };
  const validators: Record<2 | 8 | 10 | 16, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9A-F]+$/
  };
  if (!validators[base].test(clean)) {
    return { value: null, error: `Invalid base-${base} digit in "${raw}".` };
  }
  const parsed = parseInt(clean, base);
  if (!Number.isFinite(parsed) || parsed > 65535) {
    return { value: null, error: 'Please enter a non-negative integer up to 65,535 (16-bit).' };
  }
  return { value: parsed };
}

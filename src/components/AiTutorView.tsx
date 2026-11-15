import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  HelpCircle,
  Layers,
  RotateCcw,
  Send,
  Sparkles,
  User
} from 'lucide-react';
import { ALL_CHAPTERS, ALL_UNITS, getChapterById, getUnitById } from '../data';
import { useAssistantChat } from '../hooks/useAssistantChat';
import {
  AppRoute,
  MistakeRecord,
  TutorDifficulty,
  TutorMode,
  UnitId,
  UserProgress
} from '../types/academic';
import { MathBlock } from './MathBlock';

type AssistantChatController = ReturnType<typeof useAssistantChat>;

interface AiTutorViewProps {
  chat: AssistantChatController;
  progress: UserProgress;
  initialUnitId?: UnitId;
  initialChapterId?: string;
  initialPrompt?: string;
  initialMode?: TutorMode;
  initialDifficulty?: TutorDifficulty;
  onNavigate: (route: AppRoute) => void;
}

const MODES: { id: TutorMode; label: string; desc: string }[] = [
  { id: 'explain', label: 'Explain Concept', desc: 'Simple analogy, theory & example' },
  { id: 'solve', label: 'Solve Step-by-Step', desc: 'Numbered binary/Boolean steps' },
  { id: 'mistake', label: 'Check Wrong Answer', desc: 'Gentle misconception diagnosis' },
  { id: 'practice', label: 'Practice Questions', desc: '3 custom U24EC304 drills + keys' },
  { id: 'diagram', label: 'Explain Circuit / Diagram', desc: 'Pin-by-pin signal & truth table' }
];

const DIFFICULTIES: { id: TutorDifficulty; label: string }[] = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'B.E. Standard' },
  { id: 'exam', label: 'University Exam' }
];

const STARTER_CHIPS = [
  'Explain this concept in simple language',
  'Help me solve a numerical problem',
  'Explain this truth table',
  'Teach me this topic step by step',
  'Give me practice questions from this unit'
];

const QUICK_PROMPTS_BY_UNIT: Record<string, string[]> = {
  all: [
    'Explain race-around condition in JK Flip-Flop in simple language and show how Master-Slave fixes it.',
    'Convert (156.75)_10 to binary, octal, and hexadecimal step by step.',
    'Compare Direct, Associative, and Set-Associative Cache Mapping with a clear numerical.',
    'Compare K-Map and Quine-McCluskey minimization with a 4-variable example.'
  ],
  'unit-1': [
    "Subtract (11010)_2 - (10111)_2 using 2's complement and explain carry handling simply.",
    'Encode 4-bit data 1011 into 7-bit even-parity Hamming code step by step.',
    "Simplify F = A'B + ABC' + ABC using Boolean theorems."
  ],
  'unit-2': [
    'Minimize F(A,B,C,D) = sum m(0,1,2,5,8,9,10) using 4-variable K-Map.',
    'Explain Quine-McCluskey Prime Implicant table reduction step by step.',
    'Implement F(A,B,C) = sum m(1,2,4,7) using a 4:1 Multiplexer.'
  ],
  'unit-3': [
    'Derive the JK Flip-Flop excitation table from its characteristic table.',
    'Convert an SR Flip-Flop into a D Flip-Flop with K-Map equations.',
    'Compare Combinational vs Sequential circuits for a 5-mark exam answer.'
  ],
  'unit-4': [
    'Explain PC, MAR, MDR, and IR roles during an instruction fetch cycle using an everyday analogy.',
    'Compare Strobe Control vs Handshaking in Asynchronous Data Transfer.',
    'Trace DMA controller cycle stealing and bus request/grant signals.'
  ],
  'unit-5': [
    'Compare SRAM vs DRAM and PROM vs EPROM vs EEPROM in an exam table.',
    'A 64 KB direct-mapped cache has 16-byte blocks and 32-bit addresses. Find Tag, Index, and Offset bits.',
    'Explain Virtual Memory address translation using Page Table and TLB.'
  ]
};

function renderInlineSegments(text: string) {
  const tokens = text.split(/(\$\$[^$]+\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|`[^`]+`)/g);
  return tokens.map((tok, i) => {
    if (!tok) return null;
    if (tok.startsWith('$$') && tok.endsWith('$$')) {
      return <MathBlock key={i} latex={tok.slice(2, -2).trim()} displayMode />;
    }
    if (tok.startsWith('$') && tok.endsWith('$')) {
      return <MathBlock key={i} latex={tok.slice(1, -1).trim()} displayMode={false} />;
    }
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#1F2933] dark:text-white">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[#E8EFE9] dark:bg-[#1D3028] text-[#1B4332] dark:text-[#8CE0B0] font-mono text-xs"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}

function TutorRichContent({ content }: { content: string }) {
  const blocks = content.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-[#1F2933] dark:text-[#E2ECE5] deco-prose">
      {blocks.map((block, bIdx) => {
        if (!block.trim()) return null;
        if (block.startsWith('$$') && block.endsWith('$$')) {
          return (
            <div
              key={bIdx}
              className="rounded-xl bg-[#F2F5F1] dark:bg-[#0D1512] border border-[#DCE3DC] dark:border-[#253830] px-3 py-2"
            >
              <MathBlock latex={block.slice(2, -2).trim()} displayMode />
            </div>
          );
        }

        const lines = block.split('\n');
        return (
          <div key={bIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;
              if (trimmed === '---' || trimmed === '***') {
                return <hr key={lIdx} className="border-[#DCE3DC] dark:border-[#253830] my-2" />;
              }
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="text-sm font-bold text-[#1F2933] dark:text-white pt-1.5">
                    {renderInlineSegments(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
                const text = trimmed.replace(/^#+\s+/, '');
                return (
                  <h3 key={lIdx} className="text-base font-bold text-[#1B4332] dark:text-[#52B788] pt-2">
                    {renderInlineSegments(text)}
                  </h3>
                );
              }
              if (/^[-*]\s+/.test(trimmed)) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-[#0F766E] dark:text-[#2DD4BF] mt-0.5">•</span>
                    <div className="flex-1">{renderInlineSegments(trimmed.replace(/^[-*]\s+/, ''))}</div>
                  </div>
                );
              }
              if (/^\d+\.\s+/.test(trimmed)) {
                const match = trimmed.match(/^(\d+\.)\s+(.*)$/);
                if (match) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-1">
                      <span className="font-mono text-xs font-bold text-[#1B4332] dark:text-[#52B788] mt-0.5 tabular-nums">
                        {match[1]}
                      </span>
                      <div className="flex-1">{renderInlineSegments(match[2])}</div>
                    </div>
                  );
                }
              }
              if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                const cells = trimmed
                  .slice(1, -1)
                  .split('|')
                  .map((c) => c.trim());
                const isDivider = cells.every((c) => /^:?-{2,}:?$/.test(c));
                if (isDivider) return null;
                return (
                  <div
                    key={lIdx}
                    className="grid gap-2 px-2.5 py-1.5 rounded bg-[#F2F5F1] dark:bg-[#0D1512]/80 border border-[#DCE3DC] dark:border-[#253830] text-xs font-mono overflow-x-auto"
                    style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(80px, 1fr))` }}
                  >
                    {cells.map((cell, ci) => (
                      <div key={ci} className="truncate">
                        {renderInlineSegments(cell)}
                      </div>
                    ))}
                  </div>
                );
              }
              return <p key={lIdx}>{renderInlineSegments(trimmed)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export function AiTutorView({
  chat,
  progress,
  initialUnitId,
  initialChapterId,
  initialPrompt,
  initialMode,
  initialDifficulty,
  onNavigate
}: AiTutorViewProps) {
  const [input, setInput] = useState(initialPrompt || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const autoSentPromptRef = useRef<string | null>(null);

  useEffect(() => {
    const ch = initialChapterId ? getChapterById(initialChapterId) : undefined;
    if (ch) {
      chat.setUnitId(ch.unitId);
      chat.setChapterId(ch.id);
    } else if (initialUnitId) {
      chat.setUnitId(initialUnitId);
    }
    if (initialMode) chat.setMode(initialMode);
    if (initialDifficulty) chat.setDifficulty(initialDifficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUnitId, initialChapterId, initialMode, initialDifficulty]);

  useEffect(() => {
    if (initialPrompt && autoSentPromptRef.current !== initialPrompt) {
      autoSentPromptRef.current = initialPrompt;
      setInput('');
      void chat.sendMessage(initialPrompt, {
        overrideMode: initialMode,
        overrideDifficulty: initialDifficulty,
        overrideUnitId: initialChapterId
          ? getChapterById(initialChapterId)?.unitId
          : initialUnitId,
        overrideChapterId: initialChapterId
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, chat.loading]);

  const unitChapters = useMemo(() => {
    if (chat.unitId === 'all') return ALL_CHAPTERS;
    return ALL_CHAPTERS.filter((c) => c.unitId === chat.unitId);
  }, [chat.unitId]);

  const unresolvedMistakes = useMemo(
    () => progress.mistakes.filter((m) => !m.resolved),
    [progress.mistakes]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chat.loading) return;
    const text = input;
    setInput('');
    void chat.sendMessage(text);
  };

  const handleAskAboutMistake = (m: MistakeRecord) => {
    chat.setUnitId(m.unitId);
    chat.setChapterId(m.chapterId);
    chat.setMode('mistake');
    chat.setSelectedMistake(m);
    const prompt = `Why is my answer "${m.userAnswer}" incorrect for: "${m.prompt}"? The answer key says "${m.correctAnswer}". Please explain gently and step by step.`;
    void chat.sendMessage(prompt, {
      overrideMode: 'mistake',
      overrideUnitId: m.unitId,
      overrideChapterId: m.chapterId,
      mistakeOverride: m
    });
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const suggestedPrompts = QUICK_PROMPTS_BY_UNIT[chat.unitId] || QUICK_PROMPTS_BY_UNIT.all;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#1B4332] dark:text-[#52B788]" />
            <span>AI Doubt Assistant</span>
          </h1>
          <p className="text-sm text-[#52796F] dark:text-[#A4B8AC]">
            A patient engineering mentor for U24EC304 · Clear analogies, step-by-step numericals, and syllabus recommendations.
          </p>
        </div>

        <button
          onClick={chat.clearConversation}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] hover:bg-[#F2F5F1] dark:hover:bg-[#182822] text-xs font-semibold whitespace-nowrap self-start cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {chat.aiStatus.checked && !chat.aiStatus.configured && (
        <div className="rounded-2xl border border-[#B78A28]/40 bg-[#B78A28]/10 p-4 flex items-start gap-3 text-sm text-[#6B4E12] dark:text-[#F3D792]">
          <AlertCircle className="w-5 h-5 text-[#B78A28] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">GEMINI_API_KEY not configured on server</p>
            <p className="text-xs mt-0.5">
              Configure <code className="font-mono">GEMINI_API_KEY</code> in AI Studio Secrets to enable live responses from <code className="font-mono">/api/tutor/chat</code>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Controls & Context Panel */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52796F] dark:text-[#A4B8AC]">
                Explanation Depth
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => chat.setDifficulty(d.id)}
                    className={`px-2 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      chat.difficulty === d.id
                        ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                        : 'border-[#DCE3DC] dark:border-[#253830] hover:bg-[#F2F5F1] dark:hover:bg-[#182822]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#52796F] dark:text-[#A4B8AC]">
                Help Style
              </label>
              <div className="space-y-1.5">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => chat.setMode(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                      chat.mode === m.id
                        ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/80 dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0]'
                        : 'border-[#DCE3DC] dark:border-[#253830] hover:border-[#52796F]'
                    }`}
                  >
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-[11px] text-[#52796F] dark:text-[#A4B8AC]">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#DCE3DC] dark:border-[#253830]">
              <label className="block text-xs font-semibold text-[#52796F] dark:text-[#A4B8AC]">
                Syllabus Focus (Unit &amp; Lesson)
              </label>
              <select
                value={chat.unitId}
                onChange={(e) => {
                  const nextUnit = e.target.value as UnitId | 'all';
                  chat.setUnitId(nextUnit);
                  chat.setChapterId('');
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-xs font-medium"
              >
                <option value="all">All 5 Units (Auto-Detect Topic)</option>
                {ALL_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.number}: {u.title}
                  </option>
                ))}
              </select>

              <select
                value={chat.chapterId}
                onChange={(e) => {
                  const nextCh = e.target.value;
                  chat.setChapterId(nextCh);
                  const found = getChapterById(nextCh);
                  if (found) chat.setUnitId(found.unitId);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-xs font-medium"
              >
                <option value="">Any Lesson in Selected Unit</option>
                {unitChapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.chapterNumber} {ch.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unresolved Quiz Mistakes */}
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#B78A28] dark:text-[#D4A338]" />
                <span>Pending Quiz Doubts ({unresolvedMistakes.length})</span>
              </p>
              {unresolvedMistakes.length > 0 && (
                <button
                  onClick={() => onNavigate({ page: 'exam-prep', tab: 'mistakes' })}
                  className="text-[11px] font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                >
                  Mistake Tracker
                </button>
              )}
            </div>

            {unresolvedMistakes.length === 0 ? (
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
                Missed questions from lessons, quizzes, or mock exams appear here so we can walk through them together.
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {unresolvedMistakes.slice(0, 6).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleAskAboutMistake(m)}
                    className="w-full text-left p-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] hover:border-[#1B4332] dark:hover:border-[#52B788] bg-[#FBFBF7] dark:bg-[#0D1512]/60 space-y-1 cursor-pointer"
                  >
                    <p className="text-[11px] font-semibold text-[#B78A28] dark:text-[#D4A338]">
                      {getUnitById(m.unitId)?.number} · {m.topicName}
                    </p>
                    <p className="text-xs font-medium line-clamp-2">{m.prompt}</p>
                    <p className="text-[11px] text-[#52796F] dark:text-[#A4B8AC]">
                      Yours: {m.userAnswer} · Key: {m.correctAnswer}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Workspace */}
        <section className="lg:col-span-8 flex flex-col rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] min-h-[600px] max-h-[78vh]">
          <div className="px-4 py-3 border-b border-[#DCE3DC] dark:border-[#253830] flex flex-wrap items-center justify-between gap-2 text-xs text-[#52796F] dark:text-[#A4B8AC]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
              <span>
                Focus:{' '}
                {chat.unitId === 'all'
                  ? 'All 5 U24EC304 Units'
                  : `${getUnitById(chat.unitId)?.number} (${getUnitById(chat.unitId)?.title})`}
                {chat.chapterId ? ` · ${getChapterById(chat.chapterId)?.title}` : ''}
              </span>
            </span>
            <span>Verified U24EC304 grounding · Transparent sources</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {chat.messages.length === 0 ? (
              <div className="space-y-6 py-3">
                <div className="max-w-xl space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                    <Sparkles className="w-4 h-4" />
                    <span>No question is too basic — ask freely</span>
                  </div>
                  <h2 className="text-lg font-bold">
                    What topic in Digital Electronics can I make clearer for you?
                  </h2>
                  <p className="text-sm text-[#52796F] dark:text-[#A4B8AC]">
                    Choose a starter direction or click an example numerical/concept question below:
                  </p>
                </div>

                {/* Quick Starter Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setInput(chip + ': ')}
                      className="px-3 py-1.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#F2F5F1] dark:bg-[#182822] hover:border-[#1B4332] dark:hover:border-[#52B788] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Detailed Syllabus Examples */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestedPrompts.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => void chat.sendMessage(promptText)}
                      className="text-left p-3.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] hover:border-[#1B4332] dark:hover:border-[#52B788] bg-[#FBFBF7] dark:bg-[#0D1512]/50 text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] border border-[#DCE3DC] dark:border-[#253830] flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4 text-[#1B4332] dark:text-[#52B788]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] rounded-2xl p-4 space-y-3 ${
                      msg.role === 'user'
                        ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white text-sm'
                        : 'border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512]/60'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <>
                        {msg.identifiedUnitLabel && (
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#DCE3DC] dark:border-[#253830] text-xs">
                            <span className="font-semibold text-[#1B4332] dark:text-[#52B788]">
                              Syllabus Match: {msg.identifiedUnitLabel}
                            </span>

                            <div className="flex items-center gap-3">
                              {msg.recommendedChapterId && (
                                <button
                                  onClick={() =>
                                    onNavigate({
                                      page: 'chapter',
                                      chapterId: msg.recommendedChapterId!
                                    })
                                  }
                                  className="inline-flex items-center gap-1 font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                                >
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>
                                    Open Lesson: {msg.recommendedChapterTitle || 'Recommended'}
                                  </span>
                                </button>
                              )}

                              {msg.identifiedUnitId && msg.identifiedUnitId !== 'general' && (
                                <button
                                  onClick={() =>
                                    onNavigate({
                                      page: 'unit',
                                      unitId: msg.identifiedUnitId as UnitId
                                    })
                                  }
                                  className="font-medium text-[#52796F] dark:text-[#A4B8AC] hover:underline cursor-pointer"
                                >
                                  Unit Overview
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        <TutorRichContent content={msg.content} />

                        <div className="pt-2 border-t border-[#DCE3DC]/80 dark:border-[#253830] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#52796F] dark:text-[#A4B8AC]">
                          <span className="inline-flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788] shrink-0 mt-0.5" />
                            <span>
                              {msg.sourceDisclosure || 'Verified U24EC304 syllabus concepts'}
                              {msg.textbooks && msg.textbooks.length > 0
                                ? ` · ${msg.textbooks[0]}`
                                : ''}
                            </span>
                          </span>

                          <button
                            onClick={() => void handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] text-[#1F2933] dark:text-[#EEF2EE] font-medium cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-[#1B4332] dark:text-[#52B788]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Response</span>
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3028] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-[#1B4332] dark:text-[#52B788]" />
                    </div>
                  )}
                </div>
              ))
            )}

            {chat.loading && (
              <div className="flex items-center gap-3 text-sm text-[#52796F] dark:text-[#A4B8AC]">
                <div className="w-8 h-8 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] border border-[#DCE3DC] dark:border-[#253830] flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 text-[#1B4332] dark:text-[#52B788] animate-pulse" />
                </div>
                <span>Deriving a clear step-by-step explanation...</span>
              </div>
            )}

            {chat.errorMsg && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-700 dark:text-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{chat.errorMsg}</span>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Chat Input Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 border-t border-[#DCE3DC] dark:border-[#253830] flex items-end gap-2.5"
          >
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !chat.loading) {
                    const text = input;
                    setInput('');
                    void chat.sendMessage(text);
                  }
                }
              }}
              placeholder="Ask a DECO concept, paste a K-Map/Boolean expression, or request step-by-step help..."
              className="flex-1 resize-none px-3.5 py-2.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7] dark:bg-[#0D1512] text-sm text-[#1F2933] dark:text-[#EEF2EE] focus:outline-none focus:border-[#1B4332] dark:focus:border-[#52B788]"
            />
            <button
              type="submit"
              disabled={chat.loading || !input.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] disabled:opacity-40 text-white text-sm font-semibold whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Ask Assistant</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

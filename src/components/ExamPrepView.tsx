import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  Bookmark,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  Flag,
  Layers,
  Play,
  Printer,
  RotateCcw,
  Star,
  XCircle
} from 'lucide-react';
import {
  ALL_CHAPTERS,
  ALL_EXAM_QUESTIONS,
  ALL_QUIZ_QUESTIONS,
  ALL_UNITS,
  getChapterById,
  getLessonEnrichment,
  getUnitById
} from '../data';
import {
  AppRoute,
  ExamQuestionMark,
  MistakeRecord,
  QuizAttempt,
  QuizQuestion,
  UnitId,
  UserProgress
} from '../types/academic';
import { MathBlock } from './MathBlock';

type ExamTab = 'bank' | 'mock' | 'mistakes' | 'revision';

interface ExamPrepViewProps {
  initialUnitId?: UnitId;
  initialTab?: ExamTab;
  progress: UserProgress;
  onToggleSaveExamQuestion: (questionId: string) => void;
  onRecordAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
  onRecordMistake: (entry: Omit<MistakeRecord, 'id' | 'timestamp' | 'resolved'>) => void;
  onResolveMistake: (questionId: string) => void;
  onNavigate: (route: AppRoute) => void;
}

function isQuizAnswerCorrect(q: QuizQuestion, userAns: string | undefined): boolean {
  if (!userAns) return false;
  const cleanUser = userAns.trim().toLowerCase();
  const cleanCorrect = q.correctAnswer.trim().toLowerCase();
  if (q.format === 'numerical' && q.tolerance !== undefined) {
    const nUser = Number(cleanUser);
    const nCorrect = Number(cleanCorrect);
    return Number.isFinite(nUser) && Math.abs(nUser - nCorrect) <= q.tolerance;
  }
  return cleanUser === cleanCorrect;
}

export function ExamPrepView({
  initialUnitId,
  initialTab,
  progress,
  onToggleSaveExamQuestion,
  onRecordAttempt,
  onRecordMistake,
  onResolveMistake,
  onNavigate
}: ExamPrepViewProps) {
  const [activeTab, setActiveTab] = useState<ExamTab>(initialTab || 'bank');
  const [unitFilter, setUnitFilter] = useState<UnitId | 'all'>(initialUnitId || 'all');
  const [markFilter, setMarkFilter] = useState<ExamQuestionMark | 'all'>('all');
  const [collectionFilter, setCollectionFilter] = useState<'all' | 'important' | 'saved'>('all');
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

  // Timed Mock Exam state
  const [mockScope, setMockScope] = useState<UnitId | 'mixed'>(initialUnitId || 'mixed');
  const [mockMinutes, setMockMinutes] = useState<10 | 20 | 30>(20);
  const [mockQuestions, setMockQuestions] = useState<QuizQuestion[] | null>(null);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});
  const [mockFlagged, setMockFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [mockSubmitted, setMockSubmitted] = useState(false);

  // Mistake Tracker filter
  const [showResolvedMistakes, setShowResolvedMistakes] = useState(false);

  // Guided Revision Session state
  const [revUnit, setRevUnit] = useState<UnitId | 'weak'>(initialUnitId || 'unit-1');
  const [revIdx, setRevIdx] = useState(0);
  const [revRevealed, setRevRevealed] = useState(false);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialUnitId) {
      setUnitFilter(initialUnitId);
      setMockScope(initialUnitId);
      setRevUnit(initialUnitId);
    }
  }, [initialUnitId]);

  // Countdown timer for active mock exam
  useEffect(() => {
    if (!mockQuestions || mockSubmitted) return;
    if (secondsLeft <= 0) {
      finalizeMockExam();
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockQuestions, mockSubmitted, secondsLeft]);

  const filteredQuestions = useMemo(() => {
    return ALL_EXAM_QUESTIONS.filter((q) => {
      if (unitFilter !== 'all' && q.unitId !== unitFilter) return false;
      if (markFilter !== 'all' && q.marks !== markFilter) return false;
      if (collectionFilter === 'important' && !q.isImportant) return false;
      if (collectionFilter === 'saved' && !progress.savedExamQuestions.includes(q.id)) return false;
      return true;
    });
  }, [unitFilter, markFilter, collectionFilter, progress.savedExamQuestions]);

  const unresolvedMistakes = useMemo(
    () => progress.mistakes.filter((m) => !m.resolved),
    [progress.mistakes]
  );
  const displayedMistakes = useMemo(
    () =>
      showResolvedMistakes ? progress.mistakes : progress.mistakes.filter((m) => !m.resolved),
    [progress.mistakes, showResolvedMistakes]
  );

  // Weak units computed from unresolved mistakes or <70% quiz attempts
  const weakUnitIds = useMemo(() => {
    const ids = new Set<UnitId>();
    unresolvedMistakes.forEach((m) => ids.add(m.unitId));
    progress.quizAttempts
      .filter((a) => a.unitId !== 'mixed' && a.percentage < 70)
      .forEach((a) => ids.add(a.unitId as UnitId));
    if (ids.size === 0) ids.add('unit-1');
    return Array.from(ids);
  }, [unresolvedMistakes, progress.quizAttempts]);

  const revisionChapters = useMemo(() => {
    if (revUnit === 'weak') {
      return ALL_CHAPTERS.filter((c) => weakUnitIds.includes(c.unitId));
    }
    return ALL_CHAPTERS.filter((c) => c.unitId === revUnit);
  }, [revUnit, weakUnitIds]);

  const activeRevChapter = revisionChapters[revIdx] || revisionChapters[0];
  const activeRevEnrichment = activeRevChapter ? getLessonEnrichment(activeRevChapter.id) : null;

  const startMockExam = (scope: UnitId | 'mixed', durationMins: 10 | 20 | 30) => {
    const pool =
      scope === 'mixed'
        ? ALL_QUIZ_QUESTIONS
        : ALL_QUIZ_QUESTIONS.filter((q) => q.unitId === scope);
    const maxCount = durationMins === 10 ? 10 : durationMins === 20 ? 18 : pool.length;
    const selected = pool.slice(0, Math.min(maxCount, pool.length));
    setMockScope(scope);
    setMockMinutes(durationMins);
    setMockQuestions(selected);
    setMockIndex(0);
    setMockAnswers({});
    setMockFlagged({});
    setSecondsLeft(durationMins * 60);
    setMockSubmitted(false);
  };

  const finalizeMockExam = () => {
    if (!mockQuestions || mockSubmitted) return;
    setMockSubmitted(true);
    let score = 0;
    mockQuestions.forEach((q) => {
      const userAns = mockAnswers[q.id] || '';
      const ok = isQuizAnswerCorrect(q, userAns);
      if (ok) {
        score += 1;
        onResolveMistake(q.id);
      } else {
        const ch = getChapterById(q.chapterId);
        onRecordMistake({
          questionId: q.id,
          unitId: q.unitId,
          chapterId: q.chapterId,
          topicName: ch?.title || getUnitById(q.unitId)?.title || 'U24EC304 Topic',
          prompt: q.prompt,
          userAnswer: userAns.trim() || '(No answer)',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        });
      }
    });

    const elapsed = Math.max(1, mockMinutes * 60 - secondsLeft);
    const label =
      mockScope === 'mixed'
        ? 'Timed Mock Exam (Units I–V)'
        : `Timed Mock · ${getUnitById(mockScope)?.number}`;
    onRecordAttempt({
      title: label,
      unitId: mockScope,
      score,
      total: mockQuestions.length,
      percentage: Math.round((score / mockQuestions.length) * 100),
      mode: 'timed-mock',
      durationSeconds: elapsed
    });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(Math.max(0, secs) / 60);
    const s = Math.max(0, secs) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatMarkTitle = (m: ExamQuestionMark) =>
    m === '2-mark'
      ? '2-Mark Short Question'
      : m === '5-mark'
      ? '5-Mark Medium Question'
      : 'Long-Answer SEE Question (10 Marks)';

  const mockBreakdownByUnit = useMemo(() => {
    if (!mockQuestions || !mockSubmitted) return [];
    return ALL_UNITS.map((u) => {
      const qs = mockQuestions.filter((q) => q.unitId === u.id);
      if (qs.length === 0) return null;
      const correct = qs.filter((q) => isQuizAnswerCorrect(q, mockAnswers[q.id])).length;
      return {
        unit: u,
        correct,
        total: qs.length,
        pct: Math.round((correct / qs.length) * 100)
      };
    }).filter(Boolean) as {
      unit: (typeof ALL_UNITS)[number];
      correct: number;
      total: number;
      pct: number;
    }[];
  }, [mockQuestions, mockSubmitted, mockAnswers]);

  return (
    <div className="space-y-6">
      {/* Header & Top Sub-Tab Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Examination Centre
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            U24EC304 question bank (2/5/10 marks), timed mock exams, mistake tracker, and active-recall revision sessions.
          </p>
        </div>

        <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 self-start">
          {(
            [
              { id: 'bank', label: 'Question Bank' },
              { id: 'mock', label: 'Timed Mock Exam' },
              {
                id: 'mistakes',
                label: `Mistakes (${unresolvedMistakes.length})`
              },
              { id: 'revision', label: 'Revision Session' }
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: QUESTION BANK */}
      {activeTab === 'bank' && (
        <div className="space-y-5">
          <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-100/70 dark:bg-[#13201B] px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 no-print">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Question Provenance:{' '}
            </span>
            No separate college question-bank PDFs were uploaded alongside the U24EC304 syllabus screenshot. All questions below are explicitly labeled as practice revision questions generated from verified U24EC304 syllabus topics.
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 no-print">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setUnitFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                  unitFilter === 'all'
                    ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                    : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                }`}
              >
                All Units
              </button>
              {ALL_UNITS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setUnitFilter(u.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
                    unitFilter === u.id
                      ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                      : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {u.number}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800">
                {(
                  [
                    { id: 'all', label: 'All Marks' },
                    { id: '2-mark', label: '2 Marks' },
                    { id: '5-mark', label: '5 Marks' },
                    { id: 'long-answer', label: '10 Marks' }
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMarkFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      markFilter === tab.id
                        ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-slate-50 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'important', label: 'Important' },
                    { id: 'saved', label: `Saved (${progress.savedExamQuestions.length})` }
                  ] as const
                ).map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setCollectionFilter(col.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      collectionFilter === col.id
                        ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-slate-50 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 no-print">
            <span className="tabular-nums">
              Showing {filteredQuestions.length} of {ALL_EXAM_QUESTIONS.length} exam questions
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next: Record<string, boolean> = {};
                  filteredQuestions.forEach((q) => {
                    next[q.id] = true;
                  });
                  setOpenAnswers(next);
                }}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Expand All
              </button>
              <button
                onClick={() => setOpenAnswers({})}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Collapse All
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No exam questions match the selected filters. Try switching back to All Questions.
            </div>
          ) : (
            <div className="space-y-4 print-area">
              {filteredQuestions.map((q, idx) => {
                const unit = getUnitById(q.unitId);
                const isOpen = !!openAnswers[q.id];
                const isSaved = progress.savedExamQuestions.includes(q.id);
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                          {unit?.number}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">
                          {formatMarkTitle(q.marks)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{q.topicName}</span>
                        {q.isImportant && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                              <Star className="w-3 h-3 fill-current" />
                              High-Yield Exam Topic
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={() => onToggleSaveExamQuestion(q.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium cursor-pointer no-print ${
                          isSaved
                            ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'border-[#DCE3DC] dark:border-[#253830] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                      Q{idx + 1}. {q.question}
                    </h2>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 no-print">
                      <button
                        onClick={() => setOpenAnswers((p) => ({ ...p, [q.id]: !p[q.id] }))}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                      >
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        <span>{isOpen ? 'Hide Model Answer' : 'View Model Answer'}</span>
                      </button>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            onNavigate({
                              page: 'tutor',
                              unitId: q.unitId,
                              chapterId: q.chapterId,
                              mode: 'solve',
                              difficulty: 'exam',
                              initialPrompt: `Break down this ${q.marks} university exam question step by step: "${q.question}"`
                            })
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Break Down in AI Tutor</span>
                        </button>
                        <button
                          onClick={() => onNavigate({ page: 'chapter', chapterId: q.chapterId })}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
                        >
                          <span>Review Lesson</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="mt-3 pt-4 border-t border-[#DCE3DC] dark:border-[#253830] space-y-4 text-sm sm:text-base">
                        {q.answerSections.map((sec, sIdx) => (
                          <div key={sIdx} className="space-y-2">
                            {sec.heading && (
                              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {sec.heading}
                              </h3>
                            )}
                            {sec.paragraphs?.map((p, pi) => (
                              <p key={pi} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                {p}
                              </p>
                            ))}
                            {sec.bullets && (
                              <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                                {sec.bullets.map((b, bi) => (
                                  <li key={bi}>{b}</li>
                                ))}
                              </ul>
                            )}
                            {sec.latex && (
                              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border border-[#DCE3DC] dark:border-[#253830]">
                                {sec.latex.map((lx, li) => (
                                  <MathBlock key={li} latex={lx} />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TIMED MOCK EXAM */}
      {activeTab === 'mock' && (
        <div className="space-y-6">
          {!mockQuestions ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    Configure Timed Mock Examination
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Simulates CIE/SEE test pressure with a live countdown timer, question palette, flag-for-review, and unit-wise score diagnostics.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Syllabus Scope
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setMockScope('mixed')}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                        mockScope === 'mixed'
                          ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                          : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Full Syllabus (Units I–V)
                    </button>
                    {ALL_UNITS.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setMockScope(u.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                          mockScope === u.id
                            ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                            : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {u.number}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Exam Duration &amp; Length
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        { mins: 10, label: '10 Min Sprint', sub: 'Up to 10 questions' },
                        { mins: 20, label: '20 Min CIE Prep', sub: 'Up to 18 questions' },
                        { mins: 30, label: '30 Min Full Mock', sub: 'All pool questions' }
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.mins}
                        onClick={() => setMockMinutes(preset.mins)}
                        className={`text-left p-3 rounded-xl border cursor-pointer ${
                          mockMinutes === preset.mins
                            ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/75 dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0]'
                            : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <p className="text-sm font-bold">{preset.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{preset.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    startMockExam(
                      mockScope,
                      (mockMinutes === 10 || mockMinutes === 20 || mockMinutes === 30
                        ? mockMinutes
                        : 20) as 10 | 20 | 30
                    )
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Timed Mock Exam</span>
                </button>
              </div>

              <div className="lg:col-span-5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Recent Mock &amp; Quiz Scores
                </h2>
                {progress.quizAttempts.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No timed exams completed yet. Results and unit accuracy appear here after submission.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {progress.quizAttempts.slice(0, 8).map((a) => (
                      <div
                        key={a.id}
                        className="p-3 rounded-lg border border-[#DCE3DC] dark:border-[#253830] flex items-center justify-between gap-3 text-xs tabular-nums"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                            {a.title}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400">
                            {a.mode === 'timed-mock' ? 'Timed Mock' : 'Quiz'} ·{' '}
                            {new Date(a.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`font-bold text-sm shrink-0 ${
                            a.percentage >= 75
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : a.percentage >= 50
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {a.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : !mockSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Active Question Area */}
              <div className="lg:col-span-8 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DCE3DC] dark:border-[#253830]">
                  <div className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
                    Question {mockIndex + 1} of {mockQuestions.length} ·{' '}
                    {getUnitById(mockQuestions[mockIndex].unitId)?.number}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-mono font-bold tabular-nums ${
                      secondsLeft <= 60
                        ? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : 'border-[#DCE3DC] dark:border-[#253830] text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{formatTimer(secondsLeft)}</span>
                  </div>
                </div>

                {(() => {
                  const q = mockQuestions[mockIndex];
                  const userAns = mockAnswers[q.id] || '';
                  const isFlagged = !!mockFlagged[q.id];
                  return (
                    <div className="space-y-4">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                        {q.prompt}
                      </h2>

                      {q.options ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setMockAnswers((p) => ({ ...p, [q.id]: opt }))}
                              className={`text-left px-3.5 py-3 rounded-lg border text-sm transition-colors cursor-pointer ${
                                userAns === opt
                                  ? 'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/75 dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0] font-semibold'
                                  : 'border-[#DCE3DC] dark:border-[#253830] hover:border-[#1B4332] dark:hover:border-[#52B788]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={userAns}
                          onChange={(e) => setMockAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                          placeholder={
                            q.format === 'numerical'
                              ? 'Enter numeric answer...'
                              : 'Type your answer...'
                          }
                          className="w-full sm:w-96 px-3.5 py-2.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                        />
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DCE3DC] dark:border-[#253830]">
                        <button
                          onClick={() =>
                            setMockFlagged((p) => ({ ...p, [q.id]: !p[q.id] }))
                          }
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                            isFlagged
                              ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'border-[#DCE3DC] dark:border-[#253830] text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                          <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={mockIndex === 0}
                            onClick={() => setMockIndex((i) => Math.max(0, i - 1))}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Prev</span>
                          </button>
                          <button
                            disabled={mockIndex === mockQuestions.length - 1}
                            onClick={() =>
                              setMockIndex((i) => Math.min(mockQuestions.length - 1, i + 1))
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                          >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Question Palette & Submit */}
              <div className="lg:col-span-4 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                  Question Palette
                </h3>
                <div className="grid grid-cols-5 gap-2 tabular-nums">
                  {mockQuestions.map((q, idx) => {
                    const answered = !!(mockAnswers[q.id] || '').trim();
                    const flagged = !!mockFlagged[q.id];
                    const active = idx === mockIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setMockIndex(idx)}
                        className={`h-9 rounded-lg border text-xs font-bold cursor-pointer ${
                          active
                            ? 'ring-2 ring-[#1B4332] border-[#1B4332] dark:border-[#52B788]'
                            : flagged
                            ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-300'
                            : answered
                            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'border-[#DCE3DC] dark:border-[#253830] text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-2 border-t border-[#DCE3DC] dark:border-[#253830]">
                  <button
                    onClick={finalizeMockExam}
                    className="w-full py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-bold cursor-pointer"
                  >
                    Submit Mock Exam
                  </button>
                  <button
                    onClick={() => setMockQuestions(null)}
                    className="w-full py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    Cancel Exam
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Mock Results Report */
            <div className="space-y-6">
              {(() => {
                const totalCorrect = mockQuestions.filter((q) =>
                  isQuizAnswerCorrect(q, mockAnswers[q.id])
                ).length;
                const pct = Math.round((totalCorrect / mockQuestions.length) * 100);
                return (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Award className="w-9 h-9 text-emerald-500 shrink-0" />
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                          Mock Score: {totalCorrect} / {mockQuestions.length} ({pct}%)
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Missed questions were automatically added to your Mistake Tracker for targeted revision.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMockQuestions(null)}
                        className="px-4 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold cursor-pointer"
                      >
                        New Mock Exam
                      </button>
                      <button
                        onClick={() => setActiveTab('mistakes')}
                        className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        View Mistakes
                      </button>
                    </div>
                  </div>
                );
              })()}

              {mockBreakdownByUnit.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {mockBreakdownByUnit.map((item) => (
                    <div
                      key={item.unit.id}
                      className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 tabular-nums"
                    >
                      <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                        {item.unit.number}
                      </p>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                        {item.pct}%
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.correct} / {item.total} correct
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {mockQuestions.map((q, idx) => {
                  const userAns = mockAnswers[q.id] || '';
                  const ok = isQuizAnswerCorrect(q, userAns);
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 space-y-2 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <span>
                          Q{idx + 1} · {getUnitById(q.unitId)?.number}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {ok ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 dark:text-slate-50">{q.prompt}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Your answer: <strong>{userAns || '(Skipped)'}</strong> · Correct answer:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                          {q.correctAnswer}
                        </strong>
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{q.explanation}</p>
                      {!ok && (
                        <button
                          onClick={() =>
                            onNavigate({
                              page: 'tutor',
                              unitId: q.unitId,
                              chapterId: q.chapterId,
                              mode: 'mistake',
                              initialPrompt: `Why is my answer "${userAns || 'skipped'}" wrong for "${q.prompt}"? Correct answer is "${q.correctAnswer}".`
                            })
                          }
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Ask AI Tutor Why</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MISTAKE TRACKER */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Tracked Wrong Answers &amp; Misconceptions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Every missed question from lessons, quizzes, and mock exams is logged here until resolved.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showResolvedMistakes}
                onChange={(e) => setShowResolvedMistakes(e.target.checked)}
                className="accent-[#1B4332] dark:accent-[#52B788]"
              />
              <span>Show resolved mistakes</span>
            </label>
          </div>

          {displayedMistakes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                No unresolved mistakes pending
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Take a quiz or timed mock exam to test weak spots — any missed questions appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedMistakes.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      {getUnitById(m.unitId)?.number} · {m.topicName}
                    </span>
                    <span
                      className={`font-semibold ${
                        m.resolved
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {m.resolved ? 'Resolved' : 'Needs Review'} ·{' '}
                      {new Date(m.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50">
                    {m.prompt}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3">
                      <p className="font-semibold text-rose-700 dark:text-rose-300">Your Answer</p>
                      <p className="mt-0.5 text-slate-800 dark:text-slate-100 font-mono">
                        {m.userAnswer}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3">
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                        Correct Answer
                      </p>
                      <p className="mt-0.5 text-slate-800 dark:text-slate-100 font-mono">
                        {m.correctAnswer}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    {m.explanation}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() =>
                          onNavigate({
                            page: 'tutor',
                            unitId: m.unitId,
                            chapterId: m.chapterId,
                            mode: 'mistake',
                            initialPrompt: `Please explain why "${m.userAnswer}" is wrong for "${m.prompt}" and show step by step how to arrive at "${m.correctAnswer}".`
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold cursor-pointer"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Explain with AI Tutor</span>
                      </button>
                      <button
                        onClick={() => onNavigate({ page: 'chapter', chapterId: m.chapterId })}
                        className="px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium cursor-pointer"
                      >
                        Open Lesson
                      </button>
                    </div>

                    {!m.resolved && (
                      <button
                        onClick={() => onResolveMistake(m.questionId)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GUIDED REVISION SESSION */}
      {activeTab === 'revision' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setRevUnit('weak');
                  setRevIdx(0);
                  setRevRevealed(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                  revUnit === 'weak'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                }`}
              >
                Weak &amp; Flagged Topics
              </button>
              {ALL_UNITS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setRevUnit(u.id);
                    setRevIdx(0);
                    setRevRevealed(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                    revUnit === u.id
                      ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white border-[#1B4332] dark:border-[#2D6A4F]'
                      : 'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {u.number}
                </button>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
              Card {revIdx + 1} of {revisionChapters.length}
            </span>
          </div>

          {activeRevChapter && (
            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                  {getUnitById(activeRevChapter.unitId)?.number} · Lesson{' '}
                  {activeRevChapter.chapterNumber}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
                  <span>Active Recall Flashcard</span>
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {activeRevChapter.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Try recalling the core definitions, governing Boolean/hardware equations, and common pitfalls before revealing the summary sheet.
                </p>
              </div>

              {!revRevealed ? (
                <div className="rounded-xl border border-dashed border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/45 dark:bg-[#182822] p-6 text-center space-y-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Syllabus Prompt: {activeRevChapter.introduction.problemSolved}
                  </p>
                  <button
                    onClick={() => setRevRevealed(true)}
                    className="px-5 py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold cursor-pointer"
                  >
                    Reveal Key Points, Formulas &amp; Pitfalls
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-[#DCE3DC] dark:border-[#253830]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#DCE3DC] dark:border-[#253830] p-4 space-y-2">
                      <p className="text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                        Key Notebook Points
                      </p>
                      <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        {(activeRevEnrichment?.notebookNotes.length
                          ? activeRevEnrichment.notebookNotes
                          : activeRevChapter.quickRevision.corePoints
                        ).map((pt, i) => (
                          <li key={i}>{pt}</li>
                        ))}
                      </ul>
                    </div>

                    {activeRevEnrichment && activeRevEnrichment.commonMistakes.length > 0 && (
                      <div className="rounded-lg bg-amber-500/5 border border-amber-500/30 p-4 space-y-2">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Common Exam Mistake to Avoid</span>
                        </p>
                        {activeRevEnrichment.commonMistakes.map((m, i) => (
                          <div key={i} className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                            <p className="font-semibold">Pitfall: {m.mistake}</p>
                            <p className="text-emerald-700 dark:text-emerald-300">
                              Fix: {m.correction}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {activeRevChapter.formulas.length > 0 && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#DCE3DC] dark:border-[#253830] p-4 space-y-2">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        Essential Formulas
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeRevChapter.formulas.slice(0, 2).map((f) => (
                          <div key={f.id}>
                            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                              {f.name}
                            </p>
                            <MathBlock latex={f.latex} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DCE3DC] dark:border-[#253830]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate({ page: 'chapter', chapterId: activeRevChapter.id })}
                    className="px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-semibold cursor-pointer"
                  >
                    Open Full Lesson
                  </button>
                  <button
                    onClick={() =>
                      onNavigate({
                        page: 'tutor',
                        unitId: activeRevChapter.unitId,
                        chapterId: activeRevChapter.id,
                        mode: 'practice',
                        difficulty: 'exam',
                        initialPrompt: `Give me a quick active-recall quiz of 3 exam questions on ${activeRevChapter.title}.`
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#1B4332]/35 dark:border-[#52B788]/40 text-[#0F766E] dark:text-[#2DD4BF] text-xs font-semibold cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Drill in AI Tutor</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRevIdx((i) => (i > 0 ? i - 1 : revisionChapters.length - 1));
                      setRevRevealed(false);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Prev Card</span>
                  </button>
                  <button
                    onClick={() => {
                      setRevIdx((i) => (i + 1) % revisionChapters.length);
                      setRevRevealed(false);
                    }}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold cursor-pointer"
                  >
                    <span>Next Topic</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

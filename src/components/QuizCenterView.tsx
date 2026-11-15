import { useEffect, useMemo, useState } from 'react';
import { Award, Bot, CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react';
import { ALL_QUIZ_QUESTIONS, ALL_UNITS, getChapterById, getUnitById } from '../data';
import { AppRoute, MistakeRecord, QuizAttempt, QuizQuestion, UnitId } from '../types/academic';

interface QuizCenterViewProps {
  initialUnitId?: UnitId | 'mixed';
  attempts: QuizAttempt[];
  onRecordAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
  onRecordMistake: (entry: Omit<MistakeRecord, 'id' | 'timestamp' | 'resolved'>) => void;
  onResolveMistake: (questionId: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export function QuizCenterView({
  initialUnitId,
  attempts,
  onRecordAttempt,
  onRecordMistake,
  onResolveMistake,
  onNavigate
}: QuizCenterViewProps) {
  const [selectedMode, setSelectedMode] = useState<UnitId | 'mixed'>(initialUnitId || 'mixed');
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedMap, setSubmittedMap] = useState<Record<string, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const unitCounts = useMemo(() => {
    const counts: Record<string, number> = { mixed: ALL_QUIZ_QUESTIONS.length };
    ALL_UNITS.forEach((u) => {
      counts[u.id] = ALL_QUIZ_QUESTIONS.filter((q) => q.unitId === u.id).length;
    });
    return counts;
  }, []);

  const unitBestScores = useMemo(() => {
    const map: Record<string, number> = {};
    attempts.forEach((a) => {
      if (map[a.unitId] === undefined || a.percentage > map[a.unitId]) {
        map[a.unitId] = a.percentage;
      }
    });
    return map;
  }, [attempts]);

  const startQuiz = (mode: UnitId | 'mixed') => {
    setSelectedMode(mode);
    const pool =
      mode === 'mixed'
        ? ALL_QUIZ_QUESTIONS
        : ALL_QUIZ_QUESTIONS.filter((q) => q.unitId === mode);
    setActiveQuiz(pool);
    setAnswers({});
    setSubmittedMap({});
    setQuizFinished(false);
  };

  useEffect(() => {
    if (initialUnitId && initialUnitId !== 'mixed') {
      startQuiz(initialUnitId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUnitId]);

  const isAnswerCorrect = (q: QuizQuestion, userAns: string | undefined): boolean => {
    if (!userAns) return false;
    const cleanUser = userAns.trim().toLowerCase();
    const cleanCorrect = q.correctAnswer.trim().toLowerCase();
    if (q.format === 'numerical' && q.tolerance !== undefined) {
      const nUser = Number(cleanUser);
      const nCorrect = Number(cleanCorrect);
      return Number.isFinite(nUser) && Math.abs(nUser - nCorrect) <= q.tolerance;
    }
    return cleanUser === cleanCorrect;
  };

  const trackSingleOutcome = (q: QuizQuestion, userAns: string) => {
    const ok = isAnswerCorrect(q, userAns);
    if (ok) {
      onResolveMistake(q.id);
    } else {
      const ch = getChapterById(q.chapterId);
      onRecordMistake({
        questionId: q.id,
        unitId: q.unitId,
        chapterId: q.chapterId,
        topicName: ch?.title || getUnitById(q.unitId)?.title || 'DECO Topic',
        prompt: q.prompt,
        userAnswer: userAns.trim() || '(No answer)',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      });
    }
  };

  const handleSubmitSingle = (q: QuizQuestion) => {
    setSubmittedMap((prev) => ({ ...prev, [q.id]: true }));
    trackSingleOutcome(q, answers[q.id] || '');
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    const nextSubmitted: Record<string, boolean> = {};
    let score = 0;
    activeQuiz.forEach((q) => {
      nextSubmitted[q.id] = true;
      const userAns = answers[q.id] || '';
      if (isAnswerCorrect(q, userAns)) {
        score += 1;
        onResolveMistake(q.id);
      } else {
        trackSingleOutcome(q, userAns);
      }
    });
    setSubmittedMap(nextSubmitted);
    setQuizFinished(true);

    const title =
      selectedMode === 'mixed'
        ? 'Mixed-Unit SEE Practice Test'
        : `${getUnitById(selectedMode)?.number} Completion Assessment`;

    onRecordAttempt({
      title,
      unitId: selectedMode,
      score,
      total: activeQuiz.length,
      percentage: Math.round((score / activeQuiz.length) * 100),
      mode: 'practice'
    });
  };

  const currentScore = activeQuiz
    ? activeQuiz.reduce(
        (acc, q) => (submittedMap[q.id] && isAnswerCorrect(q, answers[q.id]) ? acc + 1 : acc),
        0
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Unit Assessments &amp; Quiz Centre
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Complete unit assessments for all 5 units or launch a full-syllabus drill. Incorrect answers automatically log to your Mistake Tracker.
          </p>
        </div>

        <button
          onClick={() => onNavigate({ page: 'exam-prep', tab: 'mock' })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap self-start cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#2DD4BF]" />
          <span>Timed Mock Exam Mode</span>
        </button>
      </div>

      {/* Category Launcher */}
      {!activeQuiz ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-white dark:bg-[#13201B] p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                    Full Syllabus Assessment
                  </span>
                  {unitBestScores.mixed !== undefined && (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      Best: {unitBestScores.mixed}%
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">
                  Mixed-Unit Practice Exam
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Comprehensive assessment spanning Units I–V ({unitCounts.mixed} questions).
                </p>
              </div>
              <button
                onClick={() => startQuiz('mixed')}
                className="w-full py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold cursor-pointer"
              >
                Start Full Quiz ({unitCounts.mixed} Qs)
              </button>
            </div>

            {ALL_UNITS.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      {u.number} Assessment
                    </span>
                    {unitBestScores[u.id] !== undefined && (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        Best: {unitBestScores[u.id]}%
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">
                    {u.title}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {u.description}
                  </p>
                </div>
                <button
                  onClick={() => startQuiz(u.id)}
                  className="w-full py-2.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold cursor-pointer"
                >
                  Start {u.number} Assessment ({unitCounts[u.id]} Qs)
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts History */}
          <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Recorded Assessment Performance
            </h2>
            {attempts.length === 0 ? (
              <p className="text-sm text-slate-500">
                No quiz attempts recorded yet. Complete any assessment above to save your score.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm tabular-nums">
                  <thead>
                    <tr className="border-b border-[#DCE3DC] dark:border-[#253830] text-xs text-slate-500">
                      <th className="py-2 pr-4">Assessment</th>
                      <th className="py-2 px-4">Score</th>
                      <th className="py-2 px-4">Percentage</th>
                      <th className="py-2 pl-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {attempts.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2.5 pr-4 font-medium">{a.title}</td>
                        <td className="py-2.5 px-4">
                          {a.score} / {a.total}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                          {a.percentage}%
                        </td>
                        <td className="py-2.5 pl-4 text-xs text-slate-500">
                          {new Date(a.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4">
            <div>
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                {selectedMode === 'mixed'
                  ? 'Mixed-Unit Assessment'
                  : `${getUnitById(selectedMode)?.number} Completion Assessment`}
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {activeQuiz.length} Questions · Checked: {Object.keys(submittedMap).length}/
                {activeQuiz.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startQuiz(selectedMode)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium cursor-pointer"
              >
                All Assessments
              </button>
            </div>
          </div>

          {quizFinished && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                    Final Score: {currentScore} / {activeQuiz.length} (
                    {Math.round((currentScore / activeQuiz.length) * 100)}%)
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Your score is saved and any missed questions are tracked in Examination Centre → Mistakes.
                  </p>
                </div>
              </div>
              <button
                onClick={() => startQuiz(selectedMode)}
                className="px-4 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Retry Assessment
              </button>
            </div>
          )}

          <div className="space-y-4">
            {activeQuiz.map((q, idx) => {
              const userAns = answers[q.id] || '';
              const isSubmitted = !!submittedMap[q.id];
              const correct = isAnswerCorrect(q, userAns);

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Question {idx + 1} · {getUnitById(q.unitId)?.number}
                    </span>
                    <span className="uppercase">{q.format.replace('-', ' ')}</span>
                  </div>

                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">{q.prompt}</p>

                  {q.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isChosen = userAns === opt;
                        const isOptCorrect = opt.toLowerCase() === q.correctAnswer.toLowerCase();
                        let cls = 'border-[#DCE3DC] dark:border-[#253830] hover:border-[#1B4332] dark:hover:border-[#52B788]';
                        if (isSubmitted) {
                          if (isOptCorrect) {
                            cls =
                              'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold';
                          } else if (isChosen) {
                            cls =
                              'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
                          }
                        } else if (isChosen) {
                          cls =
                            'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/75 dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0] font-semibold';
                        }

                        return (
                          <button
                            key={opt}
                            disabled={isSubmitted}
                            onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                            className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        disabled={isSubmitted}
                        value={userAns}
                        onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))}
                        placeholder={
                          q.format === 'numerical' ? 'Enter numeric answer...' : 'Type your answer...'
                        }
                        className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                      />
                    </div>
                  )}

                  {!isSubmitted ? (
                    <button
                      disabled={!userAns.trim()}
                      onClick={() => handleSubmitSingle(q)}
                      className="px-4 py-1.5 rounded-lg bg-[#1B4332] disabled:opacity-40 hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-[#DCE3DC] dark:border-[#253830] p-3.5 space-y-2 text-sm">
                      <p
                        className={`inline-flex items-center gap-1.5 font-bold ${
                          correct
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {correct ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span>
                          {correct ? 'Correct' : `Incorrect — Answer: ${q.correctAnswer}`}
                        </span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">{q.explanation}</p>
                      {!correct && (
                        <button
                          onClick={() =>
                            onNavigate({
                              page: 'tutor',
                              unitId: q.unitId,
                              chapterId: q.chapterId,
                              mode: 'mistake',
                              initialPrompt: `Why is my answer "${userAns || 'blank'}" wrong for "${q.prompt}"? The correct answer is "${q.correctAnswer}". Please walk me through it.`
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Ask AI Tutor to Explain</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizFinished && (
            <button
              onClick={handleFinishQuiz}
              className="w-full py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-bold cursor-pointer"
            >
              Finish &amp; Grade Entire Assessment
            </button>
          )}
        </div>
      )}
    </div>
  );
}

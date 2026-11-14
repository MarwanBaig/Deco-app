import { useMemo, useState } from 'react';
import { Award, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { ALL_QUIZ_QUESTIONS, ALL_UNITS, getUnitById } from '../data';
import { QuizAttempt, QuizQuestion, UnitId } from '../types/academic';

interface QuizCenterViewProps {
  initialUnitId?: UnitId | 'mixed';
  attempts: QuizAttempt[];
  onRecordAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
}

export function QuizCenterView({
  initialUnitId,
  attempts,
  onRecordAttempt
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

  const handleSubmitSingle = (qId: string) => {
    setSubmittedMap((prev) => ({ ...prev, [qId]: true }));
  };

  const handleFinishQuiz = () => {
    if (!activeQuiz) return;
    const nextSubmitted: Record<string, boolean> = {};
    let score = 0;
    activeQuiz.forEach((q) => {
      nextSubmitted[q.id] = true;
      if (isAnswerCorrect(q, answers[q.id])) score += 1;
    });
    setSubmittedMap(nextSubmitted);
    setQuizFinished(true);

    const title =
      selectedMode === 'mixed'
        ? 'Mixed-Unit SEE Practice Test'
        : `${getUnitById(selectedMode)?.number}: ${getUnitById(selectedMode)?.title}`;

    onRecordAttempt({
      title,
      unitId: selectedMode,
      score,
      total: activeQuiz.length,
      percentage: Math.round((score / activeQuiz.length) * 100)
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Quiz &amp; Practice Centre</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Unit-wise drills and Mixed-Unit SEE assessments covering MCQs, True/False, Fill-in-the-Blanks, and Numericals.
        </p>
      </div>

      {/* Category Launcher */}
      {!activeQuiz ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-xl border border-sky-500/40 bg-white dark:bg-[#11192B] p-5 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">Full Syllabus Assessment</p>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">
                  Mixed-Unit Practice Exam
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Comprehensive test spanning Units I–V ({unitCounts.mixed} questions).
                </p>
              </div>
              <button
                onClick={() => startQuiz('mixed')}
                className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold cursor-pointer"
              >
                Start Full Quiz ({unitCounts.mixed} Qs)
              </button>
            </div>

            {ALL_UNITS.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">{u.number}</p>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mt-1">{u.title}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                    {u.description}
                  </p>
                </div>
                <button
                  onClick={() => startQuiz(u.id)}
                  className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold cursor-pointer"
                >
                  Practice {u.number} ({unitCounts[u.id]} Qs)
                </button>
              </div>
            ))}
          </div>

          {/* Past Attempts History */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Recorded Quiz Performance</h2>
            {attempts.length === 0 ? (
              <p className="text-sm text-slate-500">No quiz attempts recorded yet. Complete any quiz above to save your score.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm tabular-nums">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                      <th className="py-2 pr-4">Quiz</th>
                      <th className="py-2 px-4">Score</th>
                      <th className="py-2 px-4">Percentage</th>
                      <th className="py-2 pl-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {attempts.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2.5 pr-4 font-medium">{a.title}</td>
                        <td className="py-2.5 px-4">{a.score} / {a.total}</td>
                        <td className="py-2.5 px-4 font-bold text-sky-600 dark:text-sky-400">{a.percentage}%</td>
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
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-4">
            <div>
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                {selectedMode === 'mixed' ? 'Mixed-Unit Practice' : getUnitById(selectedMode)?.number}
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {activeQuiz.length} Questions · Checked: {Object.keys(submittedMap).length}/{activeQuiz.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startQuiz(selectedMode)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                onClick={() => setActiveQuiz(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
              >
                All Quizzes
              </button>
            </div>
          </div>

          {quizFinished && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                    Final Score: {currentScore} / {activeQuiz.length} ({Math.round((currentScore / activeQuiz.length) * 100)}%)
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Your score has been saved to your study statistics.
                  </p>
                </div>
              </div>
              <button
                onClick={() => startQuiz(selectedMode)}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Retry Quiz
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
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Question {idx + 1} · {getUnitById(q.unitId)?.number}</span>
                    <span className="uppercase">{q.format.replace('-', ' ')}</span>
                  </div>

                  <p className="text-base font-bold text-slate-900 dark:text-slate-50">{q.prompt}</p>

                  {q.options ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const isChosen = userAns === opt;
                        const isOptCorrect = opt.toLowerCase() === q.correctAnswer.toLowerCase();
                        let cls = 'border-slate-200 dark:border-slate-700 hover:border-sky-400';
                        if (isSubmitted) {
                          if (isOptCorrect) {
                            cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold';
                          } else if (isChosen) {
                            cls = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
                          }
                        } else if (isChosen) {
                          cls = 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-semibold';
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
                        placeholder={q.format === 'numerical' ? 'Enter numeric answer...' : 'Type your answer...'}
                        className="w-full sm:w-80 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                      />
                    </div>
                  )}

                  {!isSubmitted ? (
                    <button
                      disabled={!userAns.trim()}
                      onClick={() => handleSubmitSingle(q.id)}
                      className="px-4 py-1.5 rounded-lg bg-sky-600 disabled:opacity-40 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3.5 space-y-1 text-sm">
                      <p className={`inline-flex items-center gap-1.5 font-bold ${correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        <span>{correct ? 'Correct' : `Incorrect — Answer: ${q.correctAnswer}`}</span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizFinished && (
            <button
              onClick={handleFinishQuiz}
              className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold cursor-pointer"
            >
              Finish &amp; Grade Entire Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}

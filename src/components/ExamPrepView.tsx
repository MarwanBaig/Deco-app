import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Printer } from 'lucide-react';
import { ALL_EXAM_QUESTIONS, ALL_UNITS, getUnitById } from '../data';
import { AppRoute, ExamQuestionMark, UnitId } from '../types/academic';
import { MathBlock } from './MathBlock';

interface ExamPrepViewProps {
  initialUnitId?: UnitId;
  onNavigate: (route: AppRoute) => void;
}

export function ExamPrepView({ initialUnitId, onNavigate }: ExamPrepViewProps) {
  const [unitFilter, setUnitFilter] = useState<UnitId | 'all'>(initialUnitId || 'all');
  const [markFilter, setMarkFilter] = useState<ExamQuestionMark | 'all'>('all');
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    return ALL_EXAM_QUESTIONS.filter((q) => {
      if (unitFilter !== 'all' && q.unitId !== unitFilter) return false;
      if (markFilter !== 'all' && q.marks !== markFilter) return false;
      return true;
    });
  }, [unitFilter, markFilter]);

  const toggleAnswer = (id: string) => {
    setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    filteredQuestions.forEach((q) => {
      next[q.id] = true;
    });
    setOpenAnswers(next);
  };

  const collapseAll = () => setOpenAnswers({});

  const formatMarkTitle = (m: ExamQuestionMark) =>
    m === '2-mark' ? '2-Mark Short Question' : m === '5-mark' ? '5-Mark Medium Question' : 'Long-Answer SEE Question (10 Marks)';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            Examination Preparation Bank
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Structured 2-mark, 5-mark, and long-answer model solutions mapped to U24EC304 (SEE: 60 Marks).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Collapse All
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Transparency Notice */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-[#11192B] px-4 py-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
        <span className="font-semibold text-slate-900 dark:text-slate-100">Question Provenance: </span>
        No separate college question-bank PDFs were uploaded alongside the U24EC304 syllabus screenshot. All questions below are explicitly labeled as practice revision questions generated from the verified U24EC304 syllabus topics.
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setUnitFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
              unitFilter === 'all'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
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
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {u.number}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 self-start">
          {(
            [
              { id: 'all', label: 'All Marks' },
              { id: '2-mark', label: '2 Marks' },
              { id: '5-mark', label: '5 Marks' },
              { id: 'long-answer', label: 'Long Answer' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMarkFilter(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                markFilter === tab.id
                  ? 'bg-white dark:bg-[#11192B] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Cards */}
      <div className="space-y-4 print-area">
        {filteredQuestions.map((q, idx) => {
          const unit = getUnitById(q.unitId);
          const isOpen = !!openAnswers[q.id];
          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sky-600 dark:text-sky-400">{unit?.number}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{formatMarkTitle(q.marks)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{q.topicName}</span>
                </div>
                <span className="text-slate-400 dark:text-slate-500">{q.sourceLabel}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                Q{idx + 1}. {q.question}
              </h2>

              <div className="flex items-center justify-between pt-1 no-print">
                <button
                  onClick={() => toggleAnswer(q.id)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{isOpen ? 'Hide Model Answer' : 'View Model Answer'}</span>
                </button>
                <button
                  onClick={() => onNavigate({ page: 'chapter', chapterId: q.chapterId })}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                >
                  <span>Review Chapter</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {isOpen && (
                <div className="mt-3 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4 text-sm sm:text-base">
                  {q.answerSections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      {sec.heading && (
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{sec.heading}</h3>
                      )}
                      {sec.paragraphs?.map((p, pi) => (
                        <p key={pi} className="text-slate-700 dark:text-slate-300 leading-relaxed">{p}</p>
                      ))}
                      {sec.bullets && (
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                          {sec.bullets.map((b, bi) => (
                            <li key={bi}>{b}</li>
                          ))}
                        </ul>
                      )}
                      {sec.latex && (
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border border-slate-200 dark:border-slate-800">
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
    </div>
  );
}

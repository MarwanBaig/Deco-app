import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Cpu,
  FileText,
  FlaskConical,
  Sigma,
  X,
  Eye
} from 'lucide-react';
import { ALL_CHAPTERS, ALL_UNITS, getChapterById } from '../data';
import { SYLLABUS_META } from '../data/syllabusMeta';
import { AppRoute, UnitId, UserProgress } from '../types/academic';

interface DashboardViewProps {
  progress: UserProgress;
  onNavigate: (route: AppRoute) => void;
}

export function DashboardView({ progress, onNavigate }: DashboardViewProps) {
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  const totalChapters = ALL_CHAPTERS.length;
  const completedCount = progress.completedChapters.length;
  const remainingCount = totalChapters - completedCount;
  const overallPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0;

  const completedUnitsCount = ALL_UNITS.filter((unit) =>
    unit.chapters.every((ch) => progress.completedChapters.includes(ch.id))
  ).length;

  const quizCount = progress.quizAttempts.length;
  const avgQuizScore =
    quizCount > 0
      ? Math.round(
          progress.quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizCount
        )
      : null;

  const continueChapter =
    (progress.lastVisitedChapterId && getChapterById(progress.lastVisitedChapterId)) ||
    ALL_CHAPTERS.find((c) => !progress.completedChapters.includes(c.id)) ||
    ALL_CHAPTERS[0];

  const getUnitProgress = (unitId: UnitId) => {
    const unit = ALL_UNITS.find((u) => u.id === unitId)!;
    const done = unit.chapters.filter((c) => progress.completedChapters.includes(c.id)).length;
    const pct = Math.round((done / unit.chapters.length) * 100);
    return { done, total: unit.chapters.length, pct };
  };

  return (
    <div className="space-y-8">
      {/* A. Welcome & Syllabus Header */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-medium text-sky-600 dark:text-sky-400 tracking-wide">
              {SYLLABUS_META.courseCode} · {SYLLABUS_META.institution} · {SYLLABUS_META.curriculum}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 text-balance">
              DECO ACADEMY — {SYLLABUS_META.courseTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A structured five-unit engineering textbook, revision notebook, interactive digital hardware lab, and exam preparation workspace mapped directly to your college syllabus.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums pt-1">
              <span>Credits: {SYLLABUS_META.evaluation.credits}</span>
              <span aria-hidden="true">·</span>
              <span>CIE: {SYLLABUS_META.evaluation.CIE} Marks</span>
              <span aria-hidden="true">·</span>
              <span>SEE: {SYLLABUS_META.evaluation.SEE} Marks</span>
              <span aria-hidden="true">·</span>
              <span>5 Units · {totalChapters} Chapters</span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate({ page: 'chapter', chapterId: continueChapter.id })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{progress.lastVisitedChapterId ? 'Continue Studying' : 'Start Unit I'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSyllabusModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Source Syllabus</span>
            </button>
          </div>
        </div>
      </section>

      {/* B. Learning Overview Metrics */}
      <section aria-label="Learning Overview">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Units</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">5</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Complete syllabus</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Chapters</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">{totalChapters}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Extracted topics</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Topics</p>
            <p className="mt-1.5 text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{completedCount}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Marked done</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Remaining Topics</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">{remainingCount}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Yet to complete</p>
          </div>

          <div className="col-span-2 lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Progress</p>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 tabular-nums">{overallPercent}%</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-300"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {completedUnitsCount} of 5 units finished
            </p>
          </div>
        </div>
      </section>

      {/* C. Five Unit Cards */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-50">
            Syllabus Units (U24EC304)
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Select a unit to study chapters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ALL_UNITS.map((unit) => {
            const { done, total, pct } = getUnitProgress(unit.id);
            const nextChapter =
              unit.chapters.find((c) => !progress.completedChapters.includes(c.id)) ||
              unit.chapters[0];

            return (
              <div
                key={unit.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-5 hover:border-sky-400/60 dark:hover:border-sky-500/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-semibold text-sky-600 dark:text-sky-400">{unit.number}</span>
                    <span>{total} Chapters · {pct}% Complete</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                    {unit.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5 tabular-nums">
                      <span>{done} / {total} completed</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate({ page: 'chapter', chapterId: nextChapter.id })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>{done > 0 ? 'Continue Learning' : 'Start Unit'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate({ page: 'unit', unitId: unit.id })}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Chapters
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* D. Quick Access & E. Study Statistics */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Quick Access Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate({ page: 'chapter', chapterId: continueChapter.id })}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                  Continue: {continueChapter.chapterNumber} {continueChapter.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Resume textbook lesson</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate({ page: 'notes' })}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer"
            >
              <FileText className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Revision Notes</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Detailed & Quick exam notes</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate({ page: 'exam-prep' })}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer"
            >
              <ClipboardList className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Important Questions</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">2-mark, 5-mark &amp; Long answers</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate({ page: 'formulas' })}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer"
            >
              <Sigma className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Formula Library</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Equations, symbols &amp; examples</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate({ page: 'quizzes' })}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Practice Quizzes</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Unit-wise &amp; SEE practice tests</p>
              </div>
            </button>

            <button
              onClick={() => onNavigate({ page: 'lab' })}
              className="flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 text-left transition-colors cursor-pointer"
            >
              <FlaskConical className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Interactive Digital Lab</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gates, K-Map, Flip-Flops, Cache</p>
              </div>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Study Statistics &amp; Recent Activity</h2>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Units Done</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                  {completedUnitsCount}/5
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Quizzes</p>
                <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                  {quizCount}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">Avg Score</p>
                <p className="mt-1 text-lg font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                  {avgQuizScore !== null ? `${avgQuizScore}%` : '—'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Recent Learning Activity
              </h3>
              {progress.recentActivity.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
                  No activity recorded yet. Open any chapter or quiz to begin tracking progress.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {progress.recentActivity.slice(0, 5).map((item, i) => (
                    <li key={`${item.chapterId}-${i}`} className="py-2 flex items-center justify-between gap-3">
                      <button
                        onClick={() => onNavigate({ page: 'chapter', chapterId: item.chapterId })}
                        className="text-left text-sm font-medium text-slate-800 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 truncate cursor-pointer"
                      >
                        {item.unitNumber} · {item.chapterTitle}
                      </button>
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                        {item.action === 'completed' ? 'Completed' : item.action === 'notes' ? 'Read Notes' : 'Studied'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-500" />
              <span>Favourites saved: {progress.favouriteChapters.length}</span>
            </span>
            <button
              onClick={() => onNavigate({ page: 'notes' })}
              className="text-sky-600 dark:text-sky-400 hover:underline font-medium cursor-pointer"
            >
              Open Saved Notes
            </button>
          </div>
        </div>
      </section>

      {/* Source Syllabus Inspection Modal */}
      {showSyllabusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11192B] p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  Verified Syllabus &amp; Source Audit ({SYLLABUS_META.courseCode})
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {SYLLABUS_META.courseTitle} — {SYLLABUS_META.institution} ({SYLLABUS_META.curriculum})
                </p>
              </div>
              <button
                onClick={() => setShowSyllabusModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Source Material Audit</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                    {SYLLABUS_META.sourceAudit.verifiedSources.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mb-2">
                    Inaccessible / Unprovided Sources Identified
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                    {SYLLABUS_META.sourceAudit.inaccessibleOrMissingSources.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Syllabus Typographical Corrections
                  </h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                    {SYLLABUS_META.sourceAudit.syllabusErrataCorrected.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Prescribed Textbooks</h3>
                  <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-5">
                    {SYLLABUS_META.textbooks.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Attached Primary Syllabus Screenshot
                </p>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={SYLLABUS_META.attachedSourceImage}
                    alt="U24EC304 Digital Electronics and Computer Organization official syllabus screenshot"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain max-h-[520px] mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

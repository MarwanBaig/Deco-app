import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Circle,
  FileText,
  HelpCircle,
  Printer
} from 'lucide-react';
import { getAdjacentChapters, getChapterById, getUnitById } from '../data';
import { AppRoute, UnitId, UserProgress } from '../types/academic';
import { MathBlock } from './MathBlock';
import { TopicDiagram } from './TopicDiagram';

interface UnitViewProps {
  unitId: UnitId;
  progress: UserProgress;
  onNavigate: (route: AppRoute) => void;
  onToggleComplete: (chapterId: string, title: string, unitNumber: string) => void;
  onToggleFavourite: (chapterId: string) => void;
}

export function UnitOverview({
  unitId,
  progress,
  onNavigate,
  onToggleComplete,
  onToggleFavourite
}: UnitViewProps) {
  const unit = getUnitById(unitId);
  if (!unit) return null;

  const doneCount = unit.chapters.filter((c) => progress.completedChapters.includes(c.id)).length;
  const pct = Math.round((doneCount / unit.chapters.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate({ page: 'dashboard' })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate({ page: 'exam-prep', unitId: unit.id })}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            Unit Exam Questions
          </button>
          <button
            onClick={() => onNavigate({ page: 'quizzes', unitId: unit.id })}
            className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Unit Quiz
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">{unit.number} · U24EC304</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{unit.title}</h1>
          </div>
          <div className="text-right tabular-nums">
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{pct}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {doneCount} of {unit.chapters.length} chapters completed
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Official College Syllabus Topics
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{unit.syllabusExactText}</p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          Chapters in {unit.number}
        </h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B]">
          {unit.chapters.map((ch) => {
            const isDone = progress.completedChapters.includes(ch.id);
            const isFav = progress.favouriteChapters.includes(ch.id);
            return (
              <div
                key={ch.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-semibold text-sky-600 dark:text-sky-400">Chapter {ch.chapterNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ch.estimatedMinutes} min study</span>
                    <span aria-hidden="true">·</span>
                    <span>{ch.workedExamples.length} worked example{ch.workedExamples.length !== 1 ? 's' : ''}</span>
                  </div>
                  <button
                    onClick={() => onNavigate({ page: 'chapter', chapterId: ch.id })}
                    className="text-left text-base font-bold text-slate-900 dark:text-slate-50 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                  >
                    {ch.title}
                  </button>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{ch.introduction.meaning}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleComplete(ch.id, ch.title, unit.number)}
                    title={isDone ? 'Completed' : 'Mark as completed'}
                    className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onToggleFavourite(ch.id)}
                    title={isFav ? 'Remove favourite' : 'Bookmark chapter'}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      isFav
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate({ page: 'chapter', chapterId: ch.id })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <span>Study Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

interface ChapterViewProps {
  chapterId: string;
  progress: UserProgress;
  onNavigate: (route: AppRoute) => void;
  onToggleComplete: (chapterId: string, title: string, unitNumber: string) => void;
  onToggleFavourite: (chapterId: string) => void;
  onCheckAnswer: (chapterId: string, questionIdx: number) => void;
}

export function ChapterLearningView({
  chapterId,
  progress,
  onNavigate,
  onToggleComplete,
  onToggleFavourite,
  onCheckAnswer
}: ChapterViewProps) {
  const chapter = getChapterById(chapterId);
  const unit = chapter ? getUnitById(chapter.unitId) : undefined;
  const { prev, next } = getAdjacentChapters(chapterId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedFlags, setCheckedFlags] = useState<Record<string, boolean>>({});

  if (!chapter || !unit) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Chapter not found.</p>
      </div>
    );
  }

  const isCompleted = progress.completedChapters.includes(chapter.id);
  const isFavourite = progress.favouriteChapters.includes(chapter.id);

  const handleSubmitCheck = (qId: string, qIndex: number) => {
    setCheckedFlags((prev) => ({ ...prev, [qId]: true }));
    onCheckAnswer(chapter.id, qIndex);
  };

  return (
    <article className="space-y-8 print-area max-w-4xl">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={() => onNavigate({ page: 'unit', unitId: unit.id })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{unit.number}: {unit.title}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onToggleFavourite(chapter.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              isFavourite
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isFavourite ? 'Saved' : 'Favourite'}</span>
          </button>

          <button
            onClick={() => onNavigate({ page: 'notes', chapterId: chapter.id })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Revision Notes</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => onToggleComplete(chapter.id, chapter.title, unit.number)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>

      {/* Chapter Title */}
      <header className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-2">
        <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
          {unit.number} · Chapter {chapter.chapterNumber} · Syllabus Topic: {chapter.syllabusTopic}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 text-balance">
          {chapter.title}
        </h1>
      </header>

      {/* A. Introduction */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">A. Introduction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-sky-600 dark:text-sky-400 mb-1">What It Means</h3>
            <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.meaning}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sky-600 dark:text-sky-400 mb-1">Why It Is Important</h3>
            <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.importance}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sky-600 dark:text-sky-400 mb-1">Where It Is Used</h3>
            <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.whereUsed}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sky-600 dark:text-sky-400 mb-1">Problem It Solves</h3>
            <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.problemSolved}</p>
          </div>
        </div>
      </section>

      {/* B. Fundamental Concept */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">B. Fundamental Concept</h2>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
          {chapter.fundamentalConcept.overview}
        </p>
        <div className="pt-2 space-y-2.5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Essential Terminology</h3>
          <dl className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
            {chapter.fundamentalConcept.terms.map((t) => (
              <div key={t.term} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:gap-4">
                <dt className="sm:w-52 shrink-0 font-semibold text-sm text-sky-700 dark:text-sky-300">{t.term}</dt>
                <dd className="text-sm text-slate-600 dark:text-slate-300">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* C. Detailed Explanation */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">C. Detailed Explanation</h2>
        {chapter.detailedExplanation.map((sub, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{sub.heading}</h3>

            {sub.paragraphs?.map((p, i) => (
              <p key={i} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">{p}</p>
            ))}

            {sub.steps && (
              <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {sub.steps.map((s, i) => (
                  <li key={i} className="leading-relaxed">{s}</li>
                ))}
              </ol>
            )}

            {sub.bullets && (
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {sub.bullets.map((b, i) => (
                  <li key={i} className="leading-relaxed">{b}</li>
                ))}
              </ul>
            )}

            {sub.table && (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                  <caption className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                    {sub.table.caption}
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                      {sub.table.headers.map((h) => (
                        <th key={h} className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sub.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* D. Diagrams and Visual Learning */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">D. Diagrams &amp; Visual Learning</h2>
        <TopicDiagram type={chapter.diagramType} caption={chapter.diagramCaption} />
      </section>

      {/* E. Worked Examples */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">E. Worked Examples</h2>
        {chapter.workedExamples.map((ex, i) => (
          <div key={ex.id} className="space-y-4 pt-2 border-t first:border-t-0 first:pt-0 border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-sky-700 dark:text-sky-300">
                Example {i + 1}: {ex.title}
              </h3>
              <p className="mt-1 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                {ex.problemStatement}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">1. Given Information</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  {ex.given.map((g, gi) => (
                    <li key={gi}>{g}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-slate-200 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">2. Required Quantity</p>
                <p className="text-slate-600 dark:text-slate-300">{ex.required}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-900 dark:text-slate-100">3. Formula &amp; 4. Substitution</p>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 p-3 border border-slate-200 dark:border-slate-800 space-y-2">
                <MathBlock latex={ex.formulaLatex} />
                <MathBlock latex={ex.substitutionLatex} />
              </div>
            </div>

            <div className="space-y-1.5 text-sm">
              <p className="font-semibold text-slate-900 dark:text-slate-100">5. Step-by-Step Calculation</p>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                {ex.calculationSteps.map((step, si) => (
                  <li key={si}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1 text-sm">
              <p className="font-bold text-emerald-700 dark:text-emerald-300">6. Final Answer: {ex.finalAnswer}</p>
              <p className="text-slate-700 dark:text-slate-300">
                <span className="font-semibold">7. Interpretation: </span>
                {ex.interpretation}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* F. Important Formulas */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">F. Important Formulas</h2>
        {chapter.formulas.map((f) => (
          <div key={f.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{f.name}</h3>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 p-3">
              <MathBlock latex={f.latex} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Symbols</p>
                <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                  {f.symbols.map((s) => (
                    <li key={s.symbol}>
                      <code className="font-mono text-sky-600 dark:text-sky-400">{s.symbol}</code>: {s.meaning}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold text-slate-800 dark:text-slate-200">Units:</span> {f.units}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-200">Conditions:</span> {f.conditions}</p>
                <p><span className="font-semibold text-slate-800 dark:text-slate-200">Mini Example:</span> {f.miniExample}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* G. Applications */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">G. Practical Applications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {chapter.applications.map((app) => (
            <div key={app.area} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5">
              <h3 className="text-sm font-bold text-sky-700 dark:text-sky-300">{app.area}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{app.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* H. Chapter Summary */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">H. Chapter Summary</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
          {chapter.summary.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </section>

      {/* I. Check Your Understanding */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11192B] p-6 space-y-5 no-print">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">I. Check Your Understanding</h2>
        </div>

        <div className="space-y-5">
          {chapter.checkUnderstanding.map((q, qIdx) => {
            const chosen = selectedAnswers[q.id];
            const isChecked = checkedFlags[q.id];
            const isCorrect = chosen === q.correctIndex;

            return (
              <div key={q.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-3">
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const selected = chosen === oIdx;
                    let cls =
                      'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-400';
                    if (isChecked) {
                      if (oIdx === q.correctIndex) {
                        cls = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold';
                      } else if (selected && oIdx !== q.correctIndex) {
                        cls = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
                      }
                    } else if (selected) {
                      cls = 'border-sky-500 bg-sky-500/10 text-sky-700 dark:text-sky-300 font-medium';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))}
                        className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    disabled={chosen === undefined}
                    onClick={() => handleSubmitCheck(q.id, qIdx)}
                    className="px-4 py-1.5 rounded-lg bg-sky-600 disabled:opacity-40 hover:bg-sky-500 text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
                  >
                    Check Answer
                  </button>
                  {isChecked && (
                    <span
                      className={`text-xs font-bold ${
                        isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                {isChecked && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg">
                    <span className="font-semibold">Explanation: </span>
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Previous / Next Chapter Navigation */}
      <nav className="flex items-center justify-between gap-4 pt-2 no-print">
        {prev ? (
          <button
            onClick={() => onNavigate({ page: 'chapter', chapterId: prev.id })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate max-w-[180px] sm:max-w-xs">{prev.chapterNumber} {prev.title}</span>
          </button>
        ) : (
          <div />
        )}

        {next ? (
          <button
            onClick={() => onNavigate({ page: 'chapter', chapterId: next.id })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold cursor-pointer"
          >
            <span className="truncate max-w-[180px] sm:max-w-xs">{next.chapterNumber} {next.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate({ page: 'quizzes' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold cursor-pointer"
          >
            <span>Take Final Practice Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </nav>
    </article>
  );
}

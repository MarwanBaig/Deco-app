import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  ClipboardList,
  FileText,
  HelpCircle,
  Lightbulb,
  Printer,
  Target
} from 'lucide-react';
import {
  getAdjacentChapters,
  getChapterById,
  getExamQuestionsForChapter,
  getLessonEnrichment,
  getUnitById
} from '../data';
import { AppRoute, Chapter, MistakeRecord, UnitId, UserProgress } from '../types/academic';
import { MathBlock } from './MathBlock';
import { TopicDiagram } from './TopicDiagram';

const LESSON_STAGES = [
  { key: 'intro', label: 'Concept & Objectives' },
  { key: 'technical', label: 'Technical Explanation' },
  { key: 'diagram', label: 'Diagrams & Flowcharts' },
  { key: 'examples', label: 'Solved Examples & Formulas' },
  { key: 'mistakes', label: 'Mistakes & Practice' }
] as const;

export function computeChapterProgressPct(chapter: Chapter, progress: UserProgress): number {
  if (progress.completedChapters.includes(chapter.id)) return 100;
  const viewed = progress.lessonSectionsViewed?.[chapter.id] || [];
  const checked = progress.checkedUnderstanding?.[chapter.id] || [];
  const totalCheck = Math.max(1, chapter.checkUnderstanding.length);
  const stageScore = (viewed.length / LESSON_STAGES.length) * 60;
  const quizScore = (Math.min(checked.length, totalCheck) / totalCheck) * 40;
  return Math.min(95, Math.round(stageScore + quizScore));
}

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
  const unitAttempts = progress.quizAttempts.filter((a) => a.unitId === unit.id);
  const bestUnitScore =
    unitAttempts.length > 0 ? Math.max(...unitAttempts.map((a) => a.percentage)) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate({ page: 'dashboard' })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Home</span>
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate({ page: 'tutor', unitId: unit.id })}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
            <span>Ask AI Tutor</span>
          </button>
          <button
            onClick={() => onNavigate({ page: 'exam-prep', unitId: unit.id })}
            className="px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap cursor-pointer"
          >
            Unit Exam Bank
          </button>
          <button
            onClick={() => onNavigate({ page: 'quizzes', unitId: unit.id })}
            className="px-3.5 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
          >
            Unit Assessment
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              {unit.number} · U24EC304 Syllabus Module
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{unit.title}</h1>
            {unit.unitOutcome && (
              <p className="text-sm text-slate-600 dark:text-slate-300 pt-1">{unit.unitOutcome}</p>
            )}
          </div>
          <div className="text-right tabular-nums shrink-0">
            <p className="text-xl font-bold text-[#0F766E] dark:text-[#2DD4BF]">{pct}%</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {doneCount} of {unit.chapters.length} lessons finished
            </p>
            {bestUnitScore !== null && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                Best Unit Assessment: {bestUnitScore}%
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-[#DCE3DC] dark:border-[#253830] p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Official College Syllabus Topics
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {unit.syllabusExactText}
            </p>
          </div>

          {unit.learningObjectives && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 border border-[#DCE3DC] dark:border-[#253830] p-4">
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>Unit Learning Objectives</span>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {unit.learningObjectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Lessons in {unit.number}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {unit.chapters.length} structured lessons
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B]">
          {unit.chapters.map((ch) => {
            const isDone = progress.completedChapters.includes(ch.id);
            const isFav = progress.favouriteChapters.includes(ch.id);
            const chPct = computeChapterProgressPct(ch, progress);
            return (
              <div
                key={ch.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      Lesson {ch.chapterNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{ch.estimatedMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {ch.workedExamples.length} worked example
                      {ch.workedExamples.length !== 1 ? 's' : ''}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        isDone
                          ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }
                    >
                      {chPct}% progress
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate({ page: 'chapter', chapterId: ch.id })}
                    className="text-left text-base font-bold text-slate-900 dark:text-slate-50 hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
                  >
                    {ch.title}
                  </button>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {ch.introduction.meaning}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleComplete(ch.id, ch.title, unit.number)}
                    title={isDone ? 'Completed' : 'Mark as completed'}
                    className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-[#DCE3DC] dark:border-[#253830] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => onToggleFavourite(ch.id)}
                    title={isFav ? 'Remove favourite' : 'Bookmark lesson'}
                    className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                      isFav
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-500'
                        : 'border-[#DCE3DC] dark:border-[#253830] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate({ page: 'chapter', chapterId: ch.id })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer"
                  >
                    <span>Open Lesson</span>
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
  onMarkSectionViewed: (chapterId: string, sectionKey: string) => void;
  onRecordMistake: (entry: Omit<MistakeRecord, 'id' | 'timestamp' | 'resolved'>) => void;
  onResolveMistake: (questionId: string) => void;
}

export function ChapterLearningView({
  chapterId,
  progress,
  onNavigate,
  onToggleComplete,
  onToggleFavourite,
  onCheckAnswer,
  onMarkSectionViewed,
  onRecordMistake,
  onResolveMistake
}: ChapterViewProps) {
  const chapter = getChapterById(chapterId);
  const unit = chapter ? getUnitById(chapter.unitId) : undefined;
  const { prev, next } = getAdjacentChapters(chapterId);

  const [lessonTab, setLessonTab] = useState<'detailed' | 'quick' | 'exam'>('detailed');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedFlags, setCheckedFlags] = useState<Record<string, boolean>>({});
  const [openExamAnswers, setOpenExamAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (chapter) {
      onMarkSectionViewed(chapter.id, 'intro');
    }
  }, [chapter?.id, onMarkSectionViewed]);

  if (!chapter || !unit) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Lesson not found.</p>
      </div>
    );
  }

  const enrichment = getLessonEnrichment(chapter.id);
  const chapterExamQs = getExamQuestionsForChapter(chapter.id);
  const isCompleted = progress.completedChapters.includes(chapter.id);
  const isFavourite = progress.favouriteChapters.includes(chapter.id);
  const viewedStages = progress.lessonSectionsViewed?.[chapter.id] || [];
  const lessonPct = computeChapterProgressPct(chapter, progress);

  const handleSubmitCheck = (qId: string, qIndex: number) => {
    const q = chapter.checkUnderstanding[qIndex];
    const chosenIdx = selectedAnswers[qId];
    setCheckedFlags((prev) => ({ ...prev, [qId]: true }));
    onCheckAnswer(chapter.id, qIndex);
    onMarkSectionViewed(chapter.id, 'mistakes');

    if (chosenIdx !== undefined) {
      if (chosenIdx === q.correctIndex) {
        onResolveMistake(qId);
      } else {
        onRecordMistake({
          questionId: qId,
          unitId: chapter.unitId,
          chapterId: chapter.id,
          topicName: chapter.title,
          prompt: q.question,
          userAnswer: q.options[chosenIdx],
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation
        });
      }
    }
  };

  return (
    <article className="space-y-6 print-area max-w-4xl deco-prose">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={() => onNavigate({ page: 'unit', unitId: unit.id })}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {unit.number}: {unit.title}
          </span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              onNavigate({
                page: 'tutor',
                unitId: unit.id,
                chapterId: chapter.id,
                mode: 'explain',
                initialPrompt: `Explain "${chapter.title}" (${unit.number}) with clear intuition, an example, and key exam tips.`
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1B4332]/35 dark:border-[#52B788]/40 bg-[#E8EFE9]/75 dark:bg-[#1D3329] text-xs font-semibold text-[#1B4332] dark:text-[#8CE0B0] hover:bg-[#E8EFE9] dark:hover:bg-[#253E32] cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
          </button>

          <button
            onClick={() => onToggleFavourite(chapter.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
              isFavourite
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'border-[#DCE3DC] dark:border-[#253830] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isFavourite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => onNavigate({ page: 'notes', chapterId: chapter.id })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notebook</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={() => onToggleComplete(chapter.id, chapter.title, unit.number)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white hover:bg-[#143326] dark:hover:bg-[#3A8263]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Completed'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header + Granular Progress + Mode Switch */}
      <header className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
              {unit.number} · Lesson {chapter.chapterNumber} · ~{chapter.estimatedMinutes} min read · Syllabus: {chapter.syllabusTopic}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 text-balance">
              {chapter.title}
            </h1>
          </div>

          <div className="sm:text-right shrink-0 tabular-nums">
            <p className="text-xs text-slate-500 dark:text-slate-400">Lesson Progress</p>
            <p className="text-lg font-bold text-[#0F766E] dark:text-[#2DD4BF]">{lessonPct}%</p>
          </div>
        </div>

        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-[#1B4332] dark:bg-[#52B788] transition-all duration-300"
            style={{ width: `${lessonPct}%` }}
          />
        </div>

        {/* Dedicated Views: Detailed Learning | Quick Revision | Examination Prep */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 no-print">
          <div className="inline-flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800/90">
            <button
              onClick={() => setLessonTab('detailed')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                lessonTab === 'detailed'
                  ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Detailed Learning</span>
            </button>
            <button
              onClick={() => setLessonTab('quick')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                lessonTab === 'quick'
                  ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Quick Revision</span>
            </button>
            <button
              onClick={() => setLessonTab('exam')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                lessonTab === 'exam'
                  ? 'bg-white dark:bg-[#13201B] text-slate-900 dark:text-slate-50 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Exam Prep ({chapterExamQs.length})</span>
            </button>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            Sections tracked: {viewedStages.length}/{LESSON_STAGES.length}
          </span>
        </div>
      </header>

      {/* ==================== TAB 1: DETAILED LEARNING ==================== */}
      {lessonTab === 'detailed' && (
        <div className="space-y-8">
          {/* 1. Introduction & Beginner Intuition */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                1. Introduction &amp; Beginner-Friendly Intuition
              </h2>
              <button
                onClick={() => onMarkSectionViewed(chapter.id, 'intro')}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 cursor-pointer no-print"
              >
                {viewedStages.includes('intro') ? 'Reviewed ✓' : 'Mark Reviewed'}
              </button>
            </div>

            {enrichment.learningObjectives.length > 0 && (
              <div className="rounded-lg border border-[#1B4332]/25 dark:border-[#52B788]/25 bg-[#E8EFE9]/45 dark:bg-[#182822] p-4 space-y-1.5">
                <p className="text-xs font-bold text-[#1B4332] dark:text-[#8CE0B0] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Lesson Learning Objectives</span>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {enrichment.learningObjectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm leading-relaxed">
              <div>
                <h3 className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1">
                  Simple Explanation (What It Means)
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.meaning}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1">
                  Why It Is Important
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.importance}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1">
                  Where It Is Used
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.whereUsed}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#0F766E] dark:text-[#2DD4BF] mb-1">
                  Engineering Problem It Solves
                </h3>
                <p className="text-slate-700 dark:text-slate-300">{chapter.introduction.problemSolved}</p>
              </div>
            </div>
          </section>

          {/* 2. Fundamental Concept & Terminology */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              2. Core Concept &amp; Essential Definitions
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              {chapter.fundamentalConcept.overview}
            </p>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 border border-[#DCE3DC] dark:border-[#253830] rounded-lg">
              {chapter.fundamentalConcept.terms.map((t) => (
                <div key={t.term} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:gap-4">
                  <dt className="sm:w-52 shrink-0 font-semibold text-sm text-[#1B4332] dark:text-[#8CE0B0]">
                    {t.term}
                  </dt>
                  <dd className="text-sm text-slate-600 dark:text-slate-300">{t.meaning}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 3. Detailed Technical Explanation */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                3. Detailed Technical Explanation
              </h2>
              <button
                onClick={() => onMarkSectionViewed(chapter.id, 'technical')}
                className="text-xs font-medium text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer no-print"
              >
                {viewedStages.includes('technical') ? 'Reviewed ✓' : 'Mark Section Studied'}
              </button>
            </div>

            {chapter.detailedExplanation.map((sub, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {sub.heading}
                </h3>

                {sub.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}

                {sub.steps && (
                  <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                    {sub.steps.map((s, i) => (
                      <li key={i} className="leading-relaxed">
                        {s}
                      </li>
                    ))}
                  </ol>
                )}

                {sub.bullets && (
                  <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                    {sub.bullets.map((b, i) => (
                      <li key={i} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {sub.table && (
                  <div className="overflow-x-auto rounded-lg border border-[#DCE3DC] dark:border-[#253830]">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                      <caption className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 border-b border-[#DCE3DC] dark:border-[#253830]">
                        {sub.table.caption}
                      </caption>
                      <thead>
                        <tr className="border-b border-[#DCE3DC] dark:border-[#253830] bg-slate-50/50 dark:bg-slate-900/30">
                          {sub.table.headers.map((h) => (
                            <th
                              key={h}
                              className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sub.table.rows.map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="hover:bg-slate-50/60 dark:hover:bg-slate-800/20"
                          >
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className="px-4 py-2.5 text-slate-700 dark:text-slate-300"
                              >
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

          {/* 4. Practical Applications */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              4. Practical Engineering Applications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chapter.applications.map((app) => (
                <div
                  key={app.area}
                  className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-3.5"
                >
                  <h3 className="text-sm font-bold text-[#1B4332] dark:text-[#8CE0B0]">{app.area}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{app.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Diagrams, Flowcharts & Visual Learning */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                5. Diagrams, Flowcharts &amp; Visual Illustrations
              </h2>
              <div className="flex items-center gap-3 no-print">
                <button
                  onClick={() => {
                    onMarkSectionViewed(chapter.id, 'diagram');
                    onNavigate({
                      page: 'tutor',
                      unitId: unit.id,
                      chapterId: chapter.id,
                      mode: 'diagram',
                      initialPrompt: `Walk me through the circuit diagram and method flowchart for "${chapter.title}" (${chapter.diagramCaption}). Explain every signal and block step by step.`
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Explain Diagram with AI Tutor</span>
                </button>
                <button
                  onClick={() => onMarkSectionViewed(chapter.id, 'diagram')}
                  className="text-xs font-medium text-slate-500 hover:text-emerald-500 cursor-pointer"
                >
                  {viewedStages.includes('diagram') ? 'Reviewed ✓' : 'Mark Studied'}
                </button>
              </div>
            </div>
            <TopicDiagram type={chapter.diagramType} caption={chapter.diagramCaption} />
          </section>

          {/* 6. Step-by-Step Solved Examples */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                6. Step-by-Step Solved Examples
              </h2>
              <button
                onClick={() => onMarkSectionViewed(chapter.id, 'examples')}
                className="text-xs font-medium text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer no-print"
              >
                {viewedStages.includes('examples') ? 'Reviewed ✓' : 'Mark Examples Studied'}
              </button>
            </div>
            {chapter.workedExamples.map((ex, i) => (
              <div
                key={ex.id}
                className="space-y-4 pt-2 border-t first:border-t-0 first:pt-0 border-[#DCE3DC] dark:border-[#253830]"
              >
                <div>
                  <h3 className="text-base font-bold text-[#1B4332] dark:text-[#8CE0B0]">
                    Example {i + 1}: {ex.title}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                    {ex.problemStatement}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-[#DCE3DC] dark:border-[#253830]">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      1. Given Information
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {ex.given.map((g, gi) => (
                        <li key={gi}>{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-[#DCE3DC] dark:border-[#253830]">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      2. Required Quantity
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">{ex.required}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    3. Formula &amp; 4. Substitution
                  </p>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/70 p-3 border border-[#DCE3DC] dark:border-[#253830] space-y-2">
                    <MathBlock latex={ex.formulaLatex} />
                    <MathBlock latex={ex.substitutionLatex} />
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    5. Step-by-Step Calculation
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 dark:text-slate-300">
                    {ex.calculationSteps.map((step, si) => (
                      <li key={si}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3.5 space-y-1 text-sm">
                  <p className="font-bold text-emerald-700 dark:text-emerald-300">
                    6. Final Answer: {ex.finalAnswer}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">7. Interpretation: </span>
                    {ex.interpretation}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* 7. Important Formulas */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              7. Important Formulas &amp; Equations
            </h2>
            {chapter.formulas.map((f) => (
              <div
                key={f.id}
                className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-4 space-y-3"
              >
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
                          <code className="font-mono text-[#0F766E] dark:text-[#2DD4BF]">
                            {s.symbol}
                          </code>
                          : {s.meaning}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
                    <p>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Units:
                      </span>{' '}
                      {f.units}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Conditions:
                      </span>{' '}
                      {f.conditions}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Mini Example:
                      </span>{' '}
                      {f.miniExample}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 8. Common Mistakes & Misconceptions + Notebook Notes */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              8. Common Mistakes, Notebook Notes &amp; Exam Shortcuts
            </h2>

            {enrichment.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <h3 className="text-sm sm:text-base font-bold">
                    Common Pitfalls to Avoid
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {enrichment.commonMistakes.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-rose-500/25 bg-rose-500/5 p-3.5 space-y-1 text-sm"
                    >
                      <p className="font-semibold text-rose-700 dark:text-rose-300">
                        Misconception: {item.mistake}
                      </p>
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Correction:{' '}
                        </span>
                        {item.correction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {enrichment.notebookNotes.length > 0 && (
              <div className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Short Notebook-Ready Notes
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {enrichment.notebookNotes.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Lightbulb className="w-4 h-4 shrink-0" />
                <h3 className="text-sm sm:text-base font-bold">
                  Tips to Remember &amp; Exam Shortcuts
                </h3>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {chapter.quickRevision.examReminders.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 9. Summary & Practice Questions */}
          <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                9. Lesson Summary
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                {chapter.summary.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>

            {chapter.quickRevision.keyDifferences && (
              <div className="overflow-x-auto rounded-lg border border-[#DCE3DC] dark:border-[#253830]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm tabular-nums">
                  <caption className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border-b border-[#DCE3DC] dark:border-[#253830]">
                    Key Comparison: {chapter.quickRevision.keyDifferences.caption}
                  </caption>
                  <thead>
                    <tr className="border-b border-[#DCE3DC] dark:border-[#253830] bg-slate-50/50 dark:bg-slate-900/30">
                      {chapter.quickRevision.keyDifferences.headers.map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {chapter.quickRevision.keyDifferences.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-4 py-2.5 text-slate-700 dark:text-slate-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="space-y-4 pt-2 border-t border-[#DCE3DC] dark:border-[#253830] no-print">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  10. Practice Questions (Check Your Understanding)
                </h2>
              </div>

              <div className="space-y-4">
                {chapter.checkUnderstanding.map((q, qIdx) => {
                  const chosen = selectedAnswers[q.id];
                  const isChecked = checkedFlags[q.id];
                  const isCorrect = chosen === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className="rounded-lg border border-[#DCE3DC] dark:border-[#253830] p-4 space-y-3"
                    >
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const selected = chosen === oIdx;
                          let cls =
                            'border-[#DCE3DC] dark:border-[#253830] text-slate-700 dark:text-slate-300 hover:border-[#1B4332] dark:hover:border-[#52B788]';
                          if (isChecked) {
                            if (oIdx === q.correctIndex) {
                              cls =
                                'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold';
                            } else if (selected && oIdx !== q.correctIndex) {
                              cls =
                                'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
                            }
                          } else if (selected) {
                            cls =
                              'border-[#1B4332] dark:border-[#52B788] bg-[#E8EFE9]/75 dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0] font-medium';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                              }
                              className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer ${cls}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <button
                          disabled={chosen === undefined}
                          onClick={() => handleSubmitCheck(q.id, qIdx)}
                          className="px-4 py-1.5 rounded-lg bg-[#1B4332] disabled:opacity-40 hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold cursor-pointer disabled:cursor-not-allowed"
                        >
                          Check Answer
                        </button>
                        {isChecked && (
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-bold ${
                                isCorrect
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {isCorrect ? 'Correct' : 'Incorrect (Logged to Mistakes)'}
                            </span>
                            {!isCorrect && chosen !== undefined && (
                              <button
                                onClick={() =>
                                  onNavigate({
                                    page: 'tutor',
                                    unitId: unit.id,
                                    chapterId: chapter.id,
                                    mode: 'mistake',
                                    initialPrompt: `I answered "${q.options[chosen]}" for the question "${q.question}" in ${chapter.title}, but the correct answer is "${q.options[q.correctIndex]}". Please explain why my answer is wrong and walk through the correct reasoning.`
                                  })
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                              >
                                <Bot className="w-3.5 h-3.5" />
                                <span>Ask AI Tutor Why</span>
                              </button>
                            )}
                          </div>
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
            </div>
          </section>
        </div>
      )}

      {/* ==================== TAB 2: QUICK REVISION (NOTEBOOK READY) ==================== */}
      {lessonTab === 'quick' && (
        <section className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCE3DC] dark:border-[#253830] pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Quick Revision &amp; Notebook Notes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                High-yield definitions, bullet takeaways, equations, and common mistake checks.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ page: 'notes', chapterId: chapter.id })}
              className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer no-print"
            >
              Open Full Notebook Export (.md) →
            </button>
          </div>

          {enrichment.notebookNotes.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                Short Notebook Notes
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {enrichment.notebookNotes.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Key Definitions
            </h3>
            <dl className="divide-y divide-slate-100 dark:divide-slate-800 border border-[#DCE3DC] dark:border-[#253830] rounded-lg">
              {chapter.quickRevision.keyDefinitions.map((kd) => (
                <div key={kd.term} className="p-3 flex flex-col sm:flex-row sm:gap-4 text-sm">
                  <dt className="sm:w-48 shrink-0 font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                    {kd.term}
                  </dt>
                  <dd className="text-slate-700 dark:text-slate-300">{kd.definition}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Core Points to Remember
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {chapter.quickRevision.corePoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
              Formula Snapshot
            </h3>
            <div className="space-y-2.5">
              {chapter.formulas.map((f) => (
                <div
                  key={f.id}
                  className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 border border-[#DCE3DC] dark:border-[#253830]"
                >
                  <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">{f.name}</p>
                  <MathBlock latex={f.latex} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <h3 className="text-sm font-bold">Tips to Remember &amp; Shortcuts</h3>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {chapter.quickRevision.examReminders.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ==================== TAB 3: EXAMINATION PREP FOR THIS LESSON ==================== */}
      {lessonTab === 'exam' && (
        <section className="space-y-4">
          <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                University Exam Questions for {chapter.chapterNumber}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Syllabus-aligned 2-mark, 5-mark, and 10-mark structured answers for this lesson.
              </p>
            </div>
            <div className="flex items-center gap-2 no-print">
              <button
                onClick={() =>
                  onNavigate({
                    page: 'tutor',
                    unitId: unit.id,
                    chapterId: chapter.id,
                    mode: 'practice',
                    difficulty: 'exam',
                    initialPrompt: `Generate 2 university exam practice questions (one 2-mark and one 5-mark numerical/design question) on "${chapter.title}" (${unit.number}) with step-by-step solutions.`
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs font-semibold cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Generate Extra Exam Qs</span>
              </button>
              <button
                onClick={() => onNavigate({ page: 'exam-prep', unitId: unit.id })}
                className="px-3.5 py-2 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Full {unit.number} Exam Bank
              </button>
            </div>
          </div>

          {chapterExamQs.length === 0 ? (
            <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 text-center space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Questions for this topic are grouped under the full {unit.number} Examination Bank.
              </p>
              <button
                onClick={() => onNavigate({ page: 'exam-prep', unitId: unit.id })}
                className="px-4 py-2 rounded-lg bg-[#1B4332] dark:bg-[#2D6A4F] text-white text-xs font-semibold cursor-pointer"
              >
                Open {unit.number} Exam Questions
              </button>
            </div>
          ) : (
            chapterExamQs.map((eq, idx) => {
              const isOpen = !!openExamAnswers[eq.id];
              return (
                <div
                  key={eq.id}
                  className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                      {eq.marks.toUpperCase()} · {eq.topicName}
                    </span>
                    <span>{eq.sourceLabel}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                    Q{idx + 1}. {eq.question}
                  </h3>
                  <button
                    onClick={() =>
                      setOpenExamAnswers((p) => ({ ...p, [eq.id]: !p[eq.id] }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    <span>{isOpen ? 'Hide Model Solution' : 'View Model Solution'}</span>
                  </button>
                  {isOpen && (
                    <div className="pt-3 border-t border-[#DCE3DC] dark:border-[#253830] space-y-3 text-sm">
                      {eq.answerSections.map((sec, sIdx) => (
                        <div key={sIdx} className="space-y-1.5">
                          {sec.heading && (
                            <p className="font-bold text-slate-900 dark:text-slate-100">
                              {sec.heading}
                            </p>
                          )}
                          {sec.paragraphs?.map((p, pi) => (
                            <p key={pi} className="text-slate-700 dark:text-slate-300">
                              {p}
                            </p>
                          ))}
                          {sec.bullets && (
                            <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
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
            })
          )}
        </section>
      )}

      {/* Previous / Next Lesson Navigation */}
      <nav className="flex items-center justify-between gap-4 pt-2 no-print">
        {prev ? (
          <button
            onClick={() => onNavigate({ page: 'chapter', chapterId: prev.id })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate max-w-[180px] sm:max-w-xs">
              {prev.chapterNumber} {prev.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {next ? (
          <button
            onClick={() => onNavigate({ page: 'chapter', chapterId: next.id })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold cursor-pointer"
          >
            <span className="truncate max-w-[180px] sm:max-w-xs">
              {next.chapterNumber} {next.title}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onNavigate({ page: 'quizzes' })}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold cursor-pointer"
          >
            <span>Take Final Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </nav>
    </article>
  );
}

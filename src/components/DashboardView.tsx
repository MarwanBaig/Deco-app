import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  ClipboardList,
  Cpu,
  Eye,
  FileText,
  FlaskConical,
  History,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  X
} from 'lucide-react';
import { ALL_CHAPTERS, ALL_UNITS, getChapterById, getUnitById } from '../data';
import { getBackdropOption } from '../data/backdrops';
import { SYLLABUS_META } from '../data/syllabusMeta';
import { AppRoute, StudentUser, StudyBackdropId, UnitId, UserProgress } from '../types/academic';
import { computeChapterProgressPct } from './UnitChapterView';

interface DashboardViewProps {
  user: StudentUser | null;
  progress: UserProgress;
  backdropId: StudyBackdropId;
  onOpenPreferences: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function DashboardView({
  user,
  progress,
  backdropId,
  onOpenPreferences,
  onNavigate
}: DashboardViewProps) {
  const [showSyllabusModal, setShowSyllabusModal] = useState(false);

  const totalChapters = ALL_CHAPTERS.length;
  const completedCount = progress.completedChapters.length;
  const remainingCount = totalChapters - completedCount;
  const overallPercent =
    totalChapters > 0
      ? Math.round(
          ALL_CHAPTERS.reduce((sum, ch) => sum + computeChapterProgressPct(ch, progress), 0) /
            totalChapters
        )
      : 0;

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

  const backdrop = getBackdropOption(backdropId);
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || null;

  const getUnitProgress = (unitId: UnitId) => {
    const unit = ALL_UNITS.find((u) => u.id === unitId)!;
    const done = unit.chapters.filter((c) => progress.completedChapters.includes(c.id)).length;
    const avgPct = Math.round(
      unit.chapters.reduce((sum, ch) => sum + computeChapterProgressPct(ch, progress), 0) /
        unit.chapters.length
    );
    return { done, total: unit.chapters.length, pct: avgPct };
  };

  // Compute upcoming revision recommendations from mistakes & low scores
  const weakRecommendations = useMemo(() => {
    const unresolved = progress.mistakes.filter((m) => !m.resolved);
    const byChapter: Record<
      string,
      {
        chapterId: string;
        unitId: UnitId;
        topicName: string;
        mistakeCount: number;
        reason: string;
      }
    > = {};

    unresolved.forEach((m) => {
      if (!byChapter[m.chapterId]) {
        byChapter[m.chapterId] = {
          chapterId: m.chapterId,
          unitId: m.unitId,
          topicName: m.topicName,
          mistakeCount: 0,
          reason: 'Unresolved quiz / check mistake'
        };
      }
      byChapter[m.chapterId].mistakeCount += 1;
    });

    const lowQuizUnits = progress.quizAttempts
      .filter((a) => a.unitId !== 'mixed' && a.percentage < 70)
      .slice(0, 3);

    lowQuizUnits.forEach((a) => {
      const u = getUnitById(a.unitId as UnitId);
      const firstCh = u?.chapters[0];
      if (firstCh && !byChapter[firstCh.id]) {
        byChapter[firstCh.id] = {
          chapterId: firstCh.id,
          unitId: u.id,
          topicName: `${u.number}: ${u.title}`,
          mistakeCount: 0,
          reason: `Recent assessment score: ${a.percentage}% (< 70%)`
        };
      }
    });

    return Object.values(byChapter)
      .sort((a, b) => b.mistakeCount - a.mistakeCount)
      .slice(0, 4);
  }, [progress.mistakes, progress.quizAttempts]);

  const unresolvedCount = progress.mistakes.filter((m) => !m.resolved).length;

  return (
    <div className="space-y-8">
      {/* A. Peaceful Personal Welcome Banner (Selective Nature Backdrop) */}
      <section className="relative rounded-2xl overflow-hidden border border-[#DCE3DC] dark:border-[#253830] bg-[#163628] text-white shadow-sm">
        {backdrop.imageUrl ? (
          <>
            <img
              src={backdrop.imageUrl}
              alt={backdrop.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E15]/92 via-[#122D21]/82 to-[#1B4332]/65" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] via-[#17392B] to-[#0F241B]" />
        )}

        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <p className="text-xs font-semibold text-[#A7DFBE] tracking-wide">
              {firstName ? `Welcome back, ${firstName}` : 'Student Study Dashboard'} ·{' '}
              {SYLLABUS_META.courseCode} · {SYLLABUS_META.institution}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
              {firstName
                ? `Ready to continue Digital Electronics, ${firstName}?`
                : SYLLABUS_META.courseTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#E4EFE8] leading-relaxed">
              Pick up right where you left off, test circuits in the Interactive Digital Lab, or ask the Doubt Assistant for step-by-step clarity.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#C6DFD0] tabular-nums pt-1">
              <span>Credits: {SYLLABUS_META.evaluation.credits}</span>
              <span aria-hidden="true">·</span>
              <span>CIE: {SYLLABUS_META.evaluation.CIE} Marks</span>
              <span aria-hidden="true">·</span>
              <span>SEE: {SYLLABUS_META.evaluation.SEE} Marks</span>
              <span aria-hidden="true">·</span>
              <span>5 Units · {totalChapters} Lessons</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate({ page: 'chapter', chapterId: continueChapter.id })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1B4332] hover:bg-[#F2F5F1] text-sm font-bold transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>
                {progress.lastVisitedChapterId
                  ? `Continue: ${continueChapter.chapterNumber}`
                  : 'Start First Lesson'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowSyllabusModal(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/25 bg-black/25 hover:bg-black/35 text-white text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Syllabus</span>
            </button>

            <button
              onClick={onOpenPreferences}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/25 bg-black/25 hover:bg-black/35 text-white text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
              title="Customize study backdrop and comfort"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Backdrop</span>
            </button>
          </div>
        </div>

        {!user && (
          <div className="relative z-10 px-6 sm:px-8 py-2.5 bg-black/25 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#D8E8DD]">
            <span className="inline-flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#8CE0B0]" />
              <span>Studying in Guest Mode (saved on this device). Sign in to sync your profile across sessions.</span>
            </span>
            <button
              onClick={() => onNavigate({ page: 'auth', mode: 'login' })}
              className="font-semibold text-[#8CE0B0] hover:underline cursor-pointer"
            >
              Login or Create Account →
            </button>
          </div>
        )}
      </section>

      {/* B. Overall Progress & Quiz Performance Strip */}
      <section aria-label="Course Progress Summary">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[#52796F] dark:text-[#A4B8AC]">
                Overall Mastery
              </p>
              <span className="text-sm font-bold text-[#1B4332] dark:text-[#52B788] tabular-nums">
                {overallPercent}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-[#E8EFE9] dark:bg-[#1D3028] overflow-hidden">
              <div
                className="h-full bg-[#1B4332] dark:bg-[#52B788] transition-all duration-300"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[#52796F] dark:text-[#A4B8AC] tabular-nums">
              {completedUnitsCount} of 5 units finished
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 sm:p-5">
            <p className="text-xs font-medium text-[#52796F] dark:text-[#A4B8AC]">
              Lessons Completed
            </p>
            <p className="mt-1.5 text-2xl font-bold text-[#1B4332] dark:text-[#52B788] tabular-nums">
              {completedCount} / {totalChapters}
            </p>
            <p className="mt-1 text-xs text-[#52796F] dark:text-[#A4B8AC] tabular-nums">
              {remainingCount} lessons remaining
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 sm:p-5">
            <p className="text-xs font-medium text-[#52796F] dark:text-[#A4B8AC]">
              Quiz Performance
            </p>
            <p className="mt-1.5 text-2xl font-bold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
              {avgQuizScore !== null ? `${avgQuizScore}%` : '—'}
            </p>
            <p className="mt-1 text-xs text-[#52796F] dark:text-[#A4B8AC] tabular-nums">
              {quizCount} test{quizCount === 1 ? '' : 's'} &amp; mock{quizCount === 1 ? '' : 's'} completed
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-4 sm:p-5">
            <p className="text-xs font-medium text-[#52796F] dark:text-[#A4B8AC]">
              Pending Mistakes
            </p>
            <p className="mt-1.5 text-2xl font-bold text-[#B78A28] dark:text-[#D4A338] tabular-nums">
              {unresolvedCount}
            </p>
            <button
              onClick={() => onNavigate({ page: 'exam-prep', tab: 'mistakes' })}
              className="mt-1 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline cursor-pointer"
            >
              {unresolvedCount > 0 ? 'Review Mistakes →' : 'All caught up'}
            </button>
          </div>
        </div>
      </section>

      {/* C. Quick Access to AI Assistant & Interactive Lab + Study Tools */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold">Quick Study Tools</h2>
          <span className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
            Jump straight into practice or doubt solving
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <button
            onClick={() => onNavigate({ page: 'tutor' })}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] dark:hover:border-[#52B788] text-left transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-[#1B4332] dark:text-[#52B788]" />
            </div>
            <div>
              <p className="text-sm font-bold">AI Doubt Assistant</p>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5">
                Simple explanations, numerical solving &amp; wrong-answer help
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate({ page: 'lab' })}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#0F766E] dark:hover:border-[#2DD4BF] text-left transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            </div>
            <div>
              <p className="text-sm font-bold">Interactive Digital Lab</p>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5">
                Gates, K-Maps, Hamming code, Flip-Flops, MUX &amp; Cache
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate({ page: 'exam-prep', tab: 'mock' })}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#B78A28] dark:hover:border-[#D4A338] text-left transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-[#B78A28] dark:text-[#D4A338]" />
            </div>
            <div>
              <p className="text-sm font-bold">Timed Mock &amp; Exam Bank</p>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5">
                2/5/10-mark university answers &amp; mistake tracker
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate({ page: 'notes' })}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] dark:hover:border-[#52B788] text-left transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#1B4332] dark:text-[#52B788]" />
            </div>
            <div>
              <p className="text-sm font-bold">Notebook &amp; Quick Notes</p>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5">
                Printable revision sheets &amp; memory reminders
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate({ page: 'formulas' })}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#0F766E] dark:hover:border-[#2DD4BF] text-left transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
              <Sigma className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
            </div>
            <div>
              <p className="text-sm font-bold">Formula Library</p>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5">
                Boolean laws, bit equations &amp; memory formulas
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate({ page: 'quizzes' })}
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] dark:hover:border-[#52B788] text-left transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#1B4332] dark:text-[#52B788]" />
            </div>
            <div>
              <p className="text-sm font-bold">Unit Assessments</p>
              <p className="text-xs text-[#52796F] dark:text-[#A4B8AC] mt-0.5">
                MCQs, numerical drills &amp; instant explanations
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* D. Simplified 5-Unit Overview Cards */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold">Course Modules (5 Units)</h2>
          <span className="text-xs text-[#52796F] dark:text-[#A4B8AC]">
            Clean topic progression across the semester
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
                className="flex flex-col justify-between rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 hover:border-[#1B4332]/60 dark:hover:border-[#52B788]/60 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#52796F] dark:text-[#A4B8AC] tabular-nums">
                    <span className="font-bold text-[#1B4332] dark:text-[#52B788]">
                      {unit.number}
                    </span>
                    <span>
                      {total} Lessons · {pct}%
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold leading-snug">{unit.title}</h3>

                  <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] leading-relaxed line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#DCE3DC]/70 dark:border-[#253830] space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-[#52796F] dark:text-[#A4B8AC] mb-1.5 tabular-nums">
                      <span>
                        {done} / {total} completed
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E8EFE9] dark:bg-[#1D3028] overflow-hidden">
                      <div
                        className="h-full bg-[#1B4332] dark:bg-[#52B788] transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate({ page: 'chapter', chapterId: nextChapter.id })}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>{done > 0 ? 'Continue' : 'Start Unit'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate({ page: 'unit', unitId: unit.id })}
                      className="px-3.5 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] hover:bg-[#F2F5F1] dark:hover:bg-[#182822] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
                    >
                      All Lessons
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* E. Upcoming Revision Suggestions & Recently Studied Lessons */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Upcoming Revision Suggestions */}
        <div className="lg:col-span-7 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
                <span>Upcoming Revision Suggestions</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#A4B8AC]">
                Prioritized from missed questions, quiz averages, and next syllabus lessons.
              </p>
            </div>
            <button
              onClick={() => onNavigate({ page: 'exam-prep', tab: 'revision' })}
              className="px-3.5 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] hover:bg-[#F2F5F1] dark:hover:bg-[#182822] text-xs font-semibold cursor-pointer"
            >
              Guided Revision
            </button>
          </div>

          {weakRecommendations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#DCE3DC] dark:border-[#253830] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FBFBF7] dark:bg-[#0D1512]/50">
              <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#A4B8AC]">
                Recommended next step:{' '}
                <strong className="text-[#1F2933] dark:text-[#EEF2EE]">
                  {continueChapter.chapterNumber} {continueChapter.title}
                </strong>{' '}
                or test yourself with a quick Unit Assessment.
              </p>
              <button
                onClick={() => onNavigate({ page: 'quizzes' })}
                className="px-3.5 py-2 rounded-xl bg-[#1B4332] dark:bg-[#2D6A4F] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
              >
                Benchmark Quiz
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {weakRecommendations.map((rec) => (
                <div
                  key={rec.chapterId}
                  className="rounded-xl border border-[#B78A28]/35 bg-[#B78A28]/5 p-4 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#B78A28] dark:text-[#D4A338] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{getUnitById(rec.unitId)?.number}</span>
                      </span>
                      {rec.mistakeCount > 0 && (
                        <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                          {rec.mistakeCount} missed Q{rec.mistakeCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold">{rec.topicName}</p>
                    <p className="text-xs text-[#52796F] dark:text-[#A4B8AC]">{rec.reason}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onNavigate({ page: 'chapter', chapterId: rec.chapterId })}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0D1512] border border-[#DCE3DC] dark:border-[#253830] text-xs font-semibold hover:border-[#1B4332] cursor-pointer"
                    >
                      Review Lesson
                    </button>
                    <button
                      onClick={() =>
                        onNavigate({
                          page: 'tutor',
                          unitId: rec.unitId,
                          chapterId: rec.chapterId,
                          mode: 'explain',
                          difficulty: 'beginner',
                          initialPrompt: `I am revising "${rec.topicName}". Explain the core idea simply with an analogy and 1 solved example.`
                        })
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1B4332] dark:bg-[#2D6A4F] text-white text-xs font-semibold cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Ask Assistant</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Studied Lessons */}
        <div className="lg:col-span-5 rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#1B4332] dark:text-[#52B788]" />
              <span>Recently Studied Lessons</span>
            </h2>

            {progress.recentActivity.length === 0 && progress.studyHistory.length === 0 ? (
              <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] py-6 px-4 border border-dashed border-[#DCE3DC] dark:border-[#253830] rounded-xl text-center">
                No lessons visited yet. Open any Unit module to start building your study timeline.
              </p>
            ) : (
              <ul className="divide-y divide-[#DCE3DC]/70 dark:divide-[#253830] max-h-60 overflow-y-auto">
                {(progress.recentActivity.length > 0
                  ? progress.recentActivity.slice(0, 6).map((act) => ({
                      key: `${act.chapterId}-${act.timestamp}`,
                      title: `${act.unitNumber} · ${act.chapterTitle}`,
                      detail:
                        act.action === 'completed'
                          ? 'Marked completed'
                          : act.action === 'notes'
                          ? 'Reviewed revision notes'
                          : 'Studied lesson',
                      tag: act.action,
                      onClick: () => onNavigate({ page: 'chapter', chapterId: act.chapterId })
                    }))
                  : progress.studyHistory.slice(0, 6).map((h) => ({
                      key: h.id,
                      title: h.title,
                      detail: h.detail,
                      tag: h.area,
                      onClick: () => {
                        if (h.chapterId) onNavigate({ page: 'chapter', chapterId: h.chapterId });
                        else if (h.area === 'quiz') onNavigate({ page: 'quizzes' });
                        else onNavigate({ page: 'tutor' });
                      }
                    }))
                ).map((item) => (
                  <li key={item.key} className="py-2.5 flex items-center justify-between gap-3">
                    <button onClick={item.onClick} className="text-left min-w-0 cursor-pointer">
                      <p className="text-xs sm:text-sm font-semibold hover:text-[#1B4332] dark:hover:text-[#52B788] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#52796F] dark:text-[#A4B8AC] truncate">
                        {item.detail}
                      </p>
                    </button>
                    <span className="text-[11px] uppercase font-semibold text-[#52796F] dark:text-[#A4B8AC] shrink-0">
                      {item.tag}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="pt-3 border-t border-[#DCE3DC]/70 dark:border-[#253830] flex items-center justify-between text-xs text-[#52796F] dark:text-[#A4B8AC]">
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
              <span>Bookmarked Lessons: {progress.favouriteChapters.length}</span>
            </span>
            <button
              onClick={() => onNavigate({ page: 'quizzes' })}
              className="text-[#0F766E] dark:text-[#2DD4BF] hover:underline font-semibold cursor-pointer"
            >
              Take Assessment →
            </button>
          </div>
        </div>
      </section>

      {/* Source Syllabus Inspection Modal */}
      {showSyllabusModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">
                  Verified Syllabus &amp; Source Audit ({SYLLABUS_META.courseCode})
                </h2>
                <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] mt-1">
                  {SYLLABUS_META.courseTitle} — {SYLLABUS_META.institution} (
                  {SYLLABUS_META.curriculum})
                </p>
              </div>
              <button
                onClick={() => setShowSyllabusModal(false)}
                className="p-2 rounded-lg hover:bg-[#F2F5F1] dark:hover:bg-[#182822] text-[#52796F] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold mb-2">Source Material Audit</h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#52796F] dark:text-[#A4B8AC] list-disc pl-5">
                    {SYLLABUS_META.sourceAudit.verifiedSources.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#B78A28] dark:text-[#D4A338] mb-2">
                    Inaccessible / Unprovided Sources Identified
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#52796F] dark:text-[#A4B8AC] list-disc pl-5">
                    {SYLLABUS_META.sourceAudit.inaccessibleOrMissingSources.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-2">Syllabus Typographical Corrections</h3>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-[#52796F] dark:text-[#A4B8AC] list-disc pl-5">
                    {SYLLABUS_META.sourceAudit.syllabusErrataCorrected.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-2">Prescribed Textbooks</h3>
                  <ol className="space-y-1.5 text-xs text-[#52796F] dark:text-[#A4B8AC] list-decimal pl-5">
                    {SYLLABUS_META.textbooks.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#52796F] dark:text-[#A4B8AC]">
                  Attached Primary Syllabus Screenshot
                </p>
                <div className="rounded-xl border border-[#DCE3DC] dark:border-[#253830] overflow-hidden bg-[#F2F5F1] dark:bg-[#0D1512]">
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

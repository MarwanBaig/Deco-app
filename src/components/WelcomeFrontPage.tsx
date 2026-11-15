import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileText,
  FlaskConical,
  Leaf,
  LogIn,
  Moon,
  SlidersHorizontal,
  Sparkles,
  Sun,
  UserPlus
} from 'lucide-react';
import { ALL_CHAPTERS, ALL_UNITS, getChapterById } from '../data';
import { getBackdropOption } from '../data/backdrops';
import { SYLLABUS_META } from '../data/syllabusMeta';
import { AppRoute, StudentUser, StudyBackdropId, UnitId, UserProgress } from '../types/academic';

interface WelcomeFrontPageProps {
  user: StudentUser | null;
  progress: UserProgress;
  theme: 'dark' | 'light';
  backdropId: StudyBackdropId;
  onToggleTheme: () => void;
  onOpenPreferences: () => void;
  onNavigate: (route: AppRoute) => void;
}

export function WelcomeFrontPage({
  user,
  progress,
  theme,
  backdropId,
  onToggleTheme,
  onOpenPreferences,
  onNavigate
}: WelcomeFrontPageProps) {
  const [openUnit, setOpenUnit] = useState<UnitId | null>('unit-1');

  const completedCount = progress.completedChapters.length;
  const totalChapters = ALL_CHAPTERS.length;
  const hasStarted = completedCount > 0 || !!progress.lastVisitedChapterId;
  const resumeChapter =
    (progress.lastVisitedChapterId && getChapterById(progress.lastVisitedChapterId)) ||
    ALL_CHAPTERS[0];

  const backdrop = getBackdropOption(backdropId);

  return (
    <div className="min-h-screen bg-[#FBFBF7] dark:bg-[#0D1512] text-[#1F2933] dark:text-[#EEF2EE]">
      {/* Clean Three-Zone Top Header */}
      <header className="sticky top-0 z-30 h-16 border-b border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7]/95 dark:bg-[#0D1512]/95 backdrop-blur px-4 sm:px-8 flex items-center justify-between gap-4">
        <button
          onClick={() => onNavigate({ page: 'welcome' })}
          className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight text-[#1B4332] dark:text-[#52B788] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Leaf className="w-5 h-5" />
          <span>DECO ACADEMY</span>
        </button>

        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#52796F] dark:text-[#A4B8AC]">
          <a
            href="#curriculum"
            className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors whitespace-nowrap"
          >
            Curriculum
          </a>
          <button
            onClick={() => onNavigate({ page: 'notes' })}
            className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors whitespace-nowrap cursor-pointer"
          >
            Course Notes
          </button>
          <button
            onClick={() => onNavigate({ page: 'lab' })}
            className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors whitespace-nowrap cursor-pointer"
          >
            Digital Lab
          </button>
          <button
            onClick={() => onNavigate({ page: 'tutor' })}
            className="hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors whitespace-nowrap cursor-pointer"
          >
            AI Assistant
          </button>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenPreferences}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-xs font-medium text-[#1F2933] dark:text-[#EEF2EE] hover:border-[#52796F] transition-colors cursor-pointer"
            title="Appearance and study backdrop"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#52796F] dark:text-[#84A98C]" />
            <span>Study Theme</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-[#52796F] dark:text-[#A4B8AC] hover:border-[#52796F] cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#D4A338]" />
            ) : (
              <Moon className="w-4 h-4 text-[#1B4332]" />
            )}
          </button>

          {user ? (
            <button
              onClick={() => onNavigate({ page: 'dashboard' })}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => onNavigate({ page: 'auth', mode: 'login' })}
                className="px-3.5 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] dark:hover:border-[#52B788] text-xs sm:text-sm font-semibold text-[#1F2933] dark:text-[#EEF2EE] transition-colors whitespace-nowrap cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate({ page: 'dashboard' })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
        {/* Serene Nature Hero Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-[#DCE3DC] dark:border-[#253830] bg-[#163628] text-white shadow-xl">
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

          <div className="relative z-10 p-7 sm:p-11 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs sm:text-sm font-semibold text-[#A7DFBE] tracking-wide">
                {SYLLABUS_META.courseCode} · {SYLLABUS_META.institution} · {SYLLABUS_META.curriculum}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold tracking-tight text-white leading-[1.15] text-balance">
                Understand Digital Electronics. Learn Beyond the Classroom.
              </h1>

              <p className="text-base sm:text-lg text-[#E4EFE8] leading-relaxed max-w-2xl">
                Your complete learning companion for Digital Electronics and Communication. Explore concepts, understand circuits, practise problems and prepare confidently for examinations.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() =>
                    hasStarted
                      ? onNavigate({ page: 'chapter', chapterId: resumeChapter.id })
                      : onNavigate({ page: 'dashboard' })
                  }
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1B4332] hover:bg-[#F2F5F1] text-sm sm:text-base font-bold transition-colors whitespace-nowrap shadow-sm cursor-pointer"
                >
                  <span>
                    {hasStarted
                      ? `Continue: ${resumeChapter.chapterNumber} ${resumeChapter.title}`
                      : 'Get Started'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!user ? (
                  <>
                    <button
                      onClick={() => onNavigate({ page: 'auth', mode: 'signup' })}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#2D6A4F]/90 hover:bg-[#2D6A4F] border border-white/25 text-white text-sm sm:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up</span>
                    </button>
                    <button
                      onClick={() => onNavigate({ page: 'auth', mode: 'login' })}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/30 bg-black/20 hover:bg-black/30 text-white text-sm sm:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onNavigate({ page: 'dashboard' })}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/30 bg-black/20 hover:bg-black/30 text-white text-sm sm:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <span>Open Student Dashboard ({user.fullName.split(' ')[0]})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Clean Structured Course Summary Card inside Hero */}
            <div className="lg:col-span-5 rounded-2xl border border-white/20 bg-[#0D1F17]/82 backdrop-blur-md p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                <h2 className="text-base font-bold text-white">Inside DECO Academy</h2>
                <span className="text-xs font-medium text-[#A7DFBE] tabular-nums">
                  {completedCount}/{totalChapters} lessons done
                </span>
              </div>

              <ul className="space-y-3.5 text-sm text-[#E4EFE8]">
                <li className="flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-[#8CE0B0] shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">3 Study Modes per Lesson:</strong> Detailed explanations, quick notebook summaries, and exam-ready derivations.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FlaskConical className="w-4 h-4 text-[#8CE0B0] shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">7 Interactive Simulators:</strong> Test Logic Gates, K-Maps, Hamming Codes, Flip-Flops, MUX &amp; Cache Mapping live.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Bot className="w-4 h-4 text-[#8CE0B0] shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">Patient AI Doubt Assistant:</strong> Clear analogies, step-by-step numericals, and instant syllabus navigation.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ClipboardList className="w-4 h-4 text-[#8CE0B0] shrink-0 mt-1" />
                  <span>
                    <strong className="text-white">University Exam Centre:</strong> 2-mark, 5-mark &amp; 10-mark answers, timed mock exams, and mistake review.
                  </span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#C6DFD0] tabular-nums">
                <span>
                  {SYLLABUS_META.evaluation.credits} Credits · CIE {SYLLABUS_META.evaluation.CIE} + SEE{' '}
                  {SYLLABUS_META.evaluation.SEE}
                </span>
                <button
                  onClick={onOpenPreferences}
                  className="text-[#8CE0B0] hover:underline font-semibold cursor-pointer"
                >
                  Change Backdrop
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Course Key Metrics Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5">
            <p className="text-2xl font-bold text-[#1B4332] dark:text-[#52B788] tabular-nums">5 Units</p>
            <p className="mt-1 text-sm font-semibold">Complete U24EC304 Syllabus</p>
            <p className="mt-0.5 text-xs text-[#52796F] dark:text-[#A4B8AC]">
              Number Systems to Virtual Memory
            </p>
          </div>
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5">
            <p className="text-2xl font-bold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
              {totalChapters} Lessons
            </p>
            <p className="mt-1 text-sm font-semibold">Structured Textbook Flow</p>
            <p className="mt-0.5 text-xs text-[#52796F] dark:text-[#A4B8AC]">
              Diagrams, flowcharts &amp; examples
            </p>
          </div>
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5">
            <p className="text-2xl font-bold text-[#1B4332] dark:text-[#52B788] tabular-nums">
              7 Modules
            </p>
            <p className="mt-1 text-sm font-semibold">Interactive Digital Lab</p>
            <p className="mt-0.5 text-xs text-[#52796F] dark:text-[#A4B8AC]">
              Hands-on circuit experimentation
            </p>
          </div>
          <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-5">
            <p className="text-2xl font-bold text-[#B78A28] dark:text-[#D4A338] tabular-nums">
              AI Assistant
            </p>
            <p className="mt-1 text-sm font-semibold">Always-Available Mentor</p>
            <p className="mt-0.5 text-xs text-[#52796F] dark:text-[#A4B8AC]">
              Dedicated view &amp; quick drawer
            </p>
          </div>
        </section>

        {/* Lesson & Feature Previews */}
        <section className="space-y-5">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
              Designed for Calm Concentration
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Everything organized into three clear study paths
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#1B4332] dark:text-[#52B788]" />
              </div>
              <h3 className="text-lg font-bold">1. Concept &amp; Circuit Notes</h3>
              <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] leading-relaxed">
                Start with plain-language intuition, examine labeled logic diagrams and truth tables, then study clean worked examples with zero clutter.
              </p>
              <button
                onClick={() => onNavigate({ page: 'notes' })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] dark:text-[#52B788] hover:underline pt-1 cursor-pointer"
              >
                <span>Browse Textbook Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-[#0F766E] dark:text-[#2DD4BF]" />
              </div>
              <h3 className="text-lg font-bold">2. Interactive Digital Lab</h3>
              <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] leading-relaxed">
                Toggle gate inputs, minimize K-Maps, inject bit errors into Hamming codes, pulse JK flip-flops, and inspect cache address bit splits.
              </p>
              <button
                onClick={() => onNavigate({ page: 'lab' })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] hover:underline pt-1 cursor-pointer"
              >
                <span>Launch Hardware Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#B78A28] dark:text-[#D4A338]" />
              </div>
              <h3 className="text-lg font-bold">3. Practice &amp; Exam Mastery</h3>
              <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] leading-relaxed">
                Prepare with 2-mark definitions, 5-mark and 10-mark worked problems, timed mock tests, and automatic mistake tracking.
              </p>
              <button
                onClick={() => onNavigate({ page: 'exam-prep' })}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B78A28] dark:text-[#D4A338] hover:underline pt-1 cursor-pointer"
              >
                <span>Open Exam Centre</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Five-Unit Curriculum Accordion Preview */}
        <section id="curriculum" className="space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
                Verified U24EC304 Syllabus
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-0.5">
                Explore All Five Units
              </h2>
            </div>
            <button
              onClick={() => onNavigate({ page: 'dashboard' })}
              className="text-sm font-semibold text-[#1B4332] dark:text-[#52B788] hover:underline cursor-pointer"
            >
              Open Full Course Dashboard →
            </button>
          </div>

          <div className="space-y-3">
            {ALL_UNITS.map((unit) => {
              const isOpen = openUnit === unit.id;
              const done = unit.chapters.filter((c) =>
                progress.completedChapters.includes(c.id)
              ).length;

              return (
                <div
                  key={unit.id}
                  className="rounded-2xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenUnit(isOpen ? null : unit.id)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left hover:bg-[#F2F5F1]/70 dark:hover:bg-[#182822] transition-colors cursor-pointer"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#0F766E] dark:text-[#2DD4BF] tabular-nums">
                        {unit.number} · {unit.chapters.length} Lessons · {done}/{unit.chapters.length} Completed
                      </p>
                      <h3 className="text-base sm:text-lg font-bold">{unit.title}</h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#52796F] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#52796F] shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-[#DCE3DC]/70 dark:border-[#253830] space-y-4">
                      <p className="text-sm text-[#52796F] dark:text-[#A4B8AC] leading-relaxed">
                        {unit.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {unit.chapters.map((ch) => {
                          const isDone = progress.completedChapters.includes(ch.id);
                          return (
                            <button
                              key={ch.id}
                              onClick={() => onNavigate({ page: 'chapter', chapterId: ch.id })}
                              className="flex items-center justify-between gap-2 p-3 rounded-xl border border-[#DCE3DC] dark:border-[#253830] hover:border-[#1B4332] dark:hover:border-[#52B788] bg-[#FBFBF7] dark:bg-[#0D1512]/60 text-left transition-colors cursor-pointer"
                            >
                              <span className="text-sm font-medium truncate">
                                {ch.chapterNumber} {ch.title}
                              </span>
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#1B4332] dark:text-[#52B788] shrink-0" />
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5 text-[#52796F] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Doubt Assistant Spotlight */}
        <section className="rounded-3xl border border-[#DCE3DC] dark:border-[#253830] bg-[#E8EFE9]/60 dark:bg-[#13201B] p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1B4332] dark:text-[#52B788]">
              <Sparkles className="w-4 h-4" />
              <span>AI Engineering Professor &amp; Doubt Assistant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Stuck on a Boolean proof, K-Map, or cache calculation?
            </h2>
            <p className="text-sm sm:text-base text-[#52796F] dark:text-[#A4B8AC] leading-relaxed">
              Ask any question from foundational definitions to university exam numericals. Get patient, everyday analogies, step-by-step derivations, truth table breakdowns, and direct links to the matching syllabus chapter.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-3">
            <button
              onClick={() => onNavigate({ page: 'tutor' })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] dark:hover:bg-[#3A8263] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Open Doubt Assistant</span>
            </button>
            <button
              onClick={() => onNavigate({ page: 'lab' })}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#0D1512] hover:border-[#1B4332] dark:hover:border-[#52B788] text-sm font-semibold transition-colors cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-[#0F766E] dark:text-[#2DD4BF]" />
              <span>Try Digital Lab</span>
            </button>
          </div>
        </section>

        {/* Academic Footer */}
        <footer className="pt-6 border-t border-[#DCE3DC] dark:border-[#253830] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#52796F] dark:text-[#A4B8AC]">
          <span className="inline-flex items-center gap-2 font-medium">
            <Leaf className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
            <span>DECO ACADEMY · U24EC304 Digital Electronics &amp; Computer Organization</span>
          </span>
          <span>LIET(A), B.E.(AIML) · AICTE 2024–25 Curriculum</span>
        </footer>
      </main>
    </div>
  );
}

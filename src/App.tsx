import { useEffect, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Sigma,
  Sun,
  X
} from 'lucide-react';
import { ALL_UNITS, getChapterById, getUnitById } from './data';
import { useProgress } from './hooks/useProgress';
import { AppRoute, UnitId } from './types/academic';
import { DashboardView } from './components/DashboardView';
import { ChapterLearningView, UnitOverview } from './components/UnitChapterView';
import { NotesView } from './components/NotesView';
import { ExamPrepView } from './components/ExamPrepView';
import { FormulaLibraryView } from './components/FormulaLibraryView';
import { InteractiveLabView } from './components/InteractiveLabView';
import { QuizCenterView } from './components/QuizCenterView';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const {
    progress,
    theme,
    toggleTheme,
    toggleChapterComplete,
    toggleFavourite,
    recordChapterVisit,
    markCheckQuestionDone,
    recordQuizAttempt,
    resetProgress
  } = useProgress();

  const [route, setRoute] = useState<AppRoute>({ page: 'dashboard' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<Record<UnitId, boolean>>({
    'unit-1': true,
    'unit-2': false,
    'unit-3': false,
    'unit-4': false,
    'unit-5': false
  });
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const navigateTo = (nextRoute: AppRoute) => {
    setRoute(nextRoute);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextRoute.page === 'chapter') {
      const ch = getChapterById(nextRoute.chapterId);
      const u = ch ? getUnitById(ch.unitId) : undefined;
      if (ch && u) {
        recordChapterVisit(ch.id, ch.title, u.number, 'studied');
        setExpandedUnits((prev) => ({ ...prev, [u.id]: true }));
      }
    } else if (nextRoute.page === 'unit') {
      setExpandedUnits((prev) => ({ ...prev, [nextRoute.unitId]: true }));
    }
  };

  const toggleUnitExpand = (unitId: UnitId) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="p-4 space-y-6 overflow-y-auto">
        <nav className="space-y-1" aria-label="Primary Workspace Navigation">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'notes', label: 'Study Notes', icon: FileText },
            { id: 'exam-prep', label: 'Exam Prep', icon: ClipboardList },
            { id: 'lab', label: 'Digital Lab', icon: FlaskConical },
            { id: 'quizzes', label: 'Practice Quizzes', icon: CheckCircle2 },
            { id: 'formulas', label: 'Formula Library', icon: Sigma }
          ].map((item) => {
            const Icon = item.icon;
            const active = route.page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo({ page: item.id } as AppRoute)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Five Units Tree */}
        <div className="space-y-1.5">
          <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            U24EC304 Syllabus Units
          </p>
          {ALL_UNITS.map((unit) => {
            const isOpen = expandedUnits[unit.id];
            const unitDone = unit.chapters.filter((c) =>
              progress.completedChapters.includes(c.id)
            ).length;
            const isUnitActive =
              (route.page === 'unit' && route.unitId === unit.id) ||
              (route.page === 'chapter' &&
                getChapterById(route.chapterId)?.unitId === unit.id);

            return (
              <div key={unit.id} className="space-y-0.5">
                <div className="flex items-center">
                  <button
                    onClick={() => toggleUnitExpand(unit.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={`Toggle ${unit.number}`}
                  >
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => navigateTo({ page: 'unit', unitId: unit.id })}
                    className={`flex-1 flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isUnitActive
                        ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="truncate">{unit.number}: {unit.title}</span>
                    <span className="text-[11px] text-slate-400 tabular-nums shrink-0">
                      {unitDone}/{unit.chapters.length}
                    </span>
                  </button>
                </div>

                {isOpen && (
                  <ul className="pl-6 space-y-0.5">
                    {unit.chapters.map((ch) => {
                      const activeCh = route.page === 'chapter' && route.chapterId === ch.id;
                      const done = progress.completedChapters.includes(ch.id);
                      return (
                        <li key={ch.id}>
                          <button
                            onClick={() => navigateTo({ page: 'chapter', chapterId: ch.id })}
                            className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-md text-left text-xs transition-colors cursor-pointer ${
                              activeCh
                                ? 'bg-sky-500/15 text-sky-600 dark:text-sky-300 font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <span className="truncate">
                              {ch.chapterNumber} {ch.title}
                            </span>
                            {done && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workspace Controls Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <span>Reset Study Progress</span>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetProgress();
                setConfirmReset(false);
              }}
              className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* Three-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark (+ mobile menu trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigateTo({ page: 'dashboard' })}
            className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            DECO ACADEMY
          </button>
        </div>

        {/* Zone 2: Concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => navigateTo({ page: 'dashboard' })}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              route.page === 'dashboard' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => navigateTo({ page: 'notes' })}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              route.page === 'notes' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => navigateTo({ page: 'exam-prep' })}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              route.page === 'exam-prep' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
            }`}
          >
            Exam Prep
          </button>
          <button
            onClick={() => navigateTo({ page: 'lab' })}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              route.page === 'lab' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
            }`}
          >
            Digital Lab
          </button>
          <button
            onClick={() => navigateTo({ page: 'quizzes' })}
            className={`hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              route.page === 'quizzes' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
            }`}
          >
            Quizzes
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Global Search) */}
        <div className="shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-sky-500 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4 text-sky-500" />
            <span>Search</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-68 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] sticky top-14 h-[calc(100vh-3.5rem)]">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-50 w-72 max-w-[85vw] bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 h-full">
              {renderSidebarContent()}
            </aside>
          </div>
        )}

        {/* Viewport Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {route.page === 'dashboard' && (
            <DashboardView progress={progress} onNavigate={navigateTo} />
          )}

          {route.page === 'unit' && (
            <UnitOverview
              unitId={route.unitId}
              progress={progress}
              onNavigate={navigateTo}
              onToggleComplete={toggleChapterComplete}
              onToggleFavourite={toggleFavourite}
            />
          )}

          {route.page === 'chapter' && (
            <ChapterLearningView
              key={route.chapterId}
              chapterId={route.chapterId}
              progress={progress}
              onNavigate={navigateTo}
              onToggleComplete={toggleChapterComplete}
              onToggleFavourite={toggleFavourite}
              onCheckAnswer={markCheckQuestionDone}
            />
          )}

          {route.page === 'notes' && (
            <NotesView
              initialChapterId={route.chapterId}
              progress={progress}
              onToggleComplete={toggleChapterComplete}
              onToggleFavourite={toggleFavourite}
              onRecordNotesRead={(id, title, unitNum) =>
                recordChapterVisit(id, title, unitNum, 'notes')
              }
            />
          )}

          {route.page === 'exam-prep' && (
            <ExamPrepView initialUnitId={route.unitId} onNavigate={navigateTo} />
          )}

          {route.page === 'lab' && (
            <InteractiveLabView initialSimulator={route.simulator} />
          )}

          {route.page === 'quizzes' && (
            <QuizCenterView
              initialUnitId={route.unitId}
              attempts={progress.quizAttempts}
              onRecordAttempt={recordQuizAttempt}
            />
          )}

          {route.page === 'formulas' && (
            <FormulaLibraryView initialUnitId={route.unitId} onNavigate={navigateTo} />
          )}

          {/* Clean Footer */}
          <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 no-print">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              <span>DECO ACADEMY · U24EC304 Digital Electronics &amp; Computer Organization</span>
            </span>
            <span>LIET(A), B.E.(AIML) · AICTE 2024–25 Syllabus</span>
          </footer>
        </main>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateTo}
      />
    </div>
  );
}

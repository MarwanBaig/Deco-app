import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  Home,
  LayoutDashboard,
  Leaf,
  LogIn,
  LogOut,
  Menu,
  Moon,
  RotateCcw,
  Search,
  Sigma,
  SlidersHorizontal,
  Sun,
  User as UserIcon,
  X
} from 'lucide-react';
import { ALL_UNITS, getChapterById, getUnitById } from './data';
import { useAssistantChat } from './hooks/useAssistantChat';
import { useProgress } from './hooks/useProgress';
import { AppRoute, UnitId } from './types/academic';
import { AiTutorView } from './components/AiTutorView';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { ExamPrepView } from './components/ExamPrepView';
import { FloatingAssistantDrawer } from './components/FloatingAssistantDrawer';
import { FormulaLibraryView } from './components/FormulaLibraryView';
import { InteractiveLabView } from './components/InteractiveLabView';
import { NotesView } from './components/NotesView';
import { PreferencesModal } from './components/PreferencesModal';
import { QuizCenterView } from './components/QuizCenterView';
import { SearchModal } from './components/SearchModal';
import { ChapterLearningView, UnitOverview } from './components/UnitChapterView';
import { WelcomeFrontPage } from './components/WelcomeFrontPage';

interface BreadcrumbSegment {
  label: string;
  route?: AppRoute;
}

export default function App() {
  const {
    user,
    progress,
    theme,
    preferences,
    setTheme,
    toggleTheme,
    setBackdrop,
    setReadingComfort,
    handleAuthSuccess,
    logout,
    toggleChapterComplete,
    toggleFavourite,
    toggleSaveExamQuestion,
    markLessonSectionViewed,
    recordChapterVisit,
    markCheckQuestionDone,
    recordMistake,
    resolveMistake,
    recordQuizAttempt,
    recordStudyEvent,
    resetProgress
  } = useProgress();

  const assistantChat = useAssistantChat(recordStudyEvent);

  const [route, setRoute] = useState<AppRoute>({ page: 'welcome' });
  const [routeHistory, setRouteHistory] = useState<AppRoute[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
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

  const navigateTo = (nextRoute: AppRoute, pushHistory = true) => {
    if (pushHistory) {
      setRouteHistory((prev) => [...prev.slice(-19), route]);
    }
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
    } else if (nextRoute.page === 'lab') {
      recordStudyEvent({
        area: 'lab',
        title: 'Interactive Digital Lab',
        detail: nextRoute.simulator ? `Opened ${nextRoute.simulator}` : 'Opened hardware lab'
      });
    }
  };

  const handleBack = () => {
    if (routeHistory.length > 0) {
      const prev = routeHistory[routeHistory.length - 1];
      setRouteHistory((h) => h.slice(0, -1));
      navigateTo(prev, false);
      return;
    }
    if (route.page === 'chapter') {
      const ch = getChapterById(route.chapterId);
      if (ch) {
        navigateTo({ page: 'unit', unitId: ch.unitId }, false);
        return;
      }
    }
    if (route.page === 'dashboard') {
      navigateTo({ page: 'welcome' }, false);
    } else {
      navigateTo({ page: 'dashboard' }, false);
    }
  };

  const breadcrumbs = useMemo<BreadcrumbSegment[]>(() => {
    const base: BreadcrumbSegment[] = [
      { label: 'Welcome', route: { page: 'welcome' } },
      { label: 'Course Home', route: { page: 'dashboard' } }
    ];

    if (route.page === 'dashboard') {
      return [
        { label: 'Welcome', route: { page: 'welcome' } },
        { label: 'Student Dashboard' }
      ];
    }
    if (route.page === 'unit') {
      const u = getUnitById(route.unitId);
      return [...base, { label: u ? `${u.number}: ${u.title}` : 'Unit Overview' }];
    }
    if (route.page === 'chapter') {
      const ch = getChapterById(route.chapterId);
      const u = ch ? getUnitById(ch.unitId) : undefined;
      return [
        ...base,
        ...(u ? [{ label: u.number, route: { page: 'unit', unitId: u.id } as AppRoute }] : []),
        { label: ch ? `${ch.chapterNumber} ${ch.title}` : 'Lesson' }
      ];
    }
    if (route.page === 'notes') {
      const ch = route.chapterId ? getChapterById(route.chapterId) : undefined;
      return [
        ...base,
        { label: 'Course Notes', route: ch ? { page: 'notes' } : undefined },
        ...(ch ? [{ label: `${ch.chapterNumber} ${ch.title}` }] : [])
      ];
    }
    if (route.page === 'exam-prep') return [...base, { label: 'Exam Centre' }];
    if (route.page === 'lab') return [...base, { label: 'Interactive Digital Lab' }];
    if (route.page === 'quizzes') return [...base, { label: 'Unit Assessments' }];
    if (route.page === 'formulas') return [...base, { label: 'Formula Library' }];
    if (route.page === 'tutor') return [...base, { label: 'AI Doubt Assistant' }];
    return base;
  }, [route]);

  const toggleUnitExpand = (unitId: UnitId) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const renderSidebarNavGroup = (
    heading: string,
    items: { id: AppRoute['page']; label: string; icon: typeof Home }[]
  ) => (
    <div className="space-y-1.5">
      <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#52796F] dark:text-[#84A98C]">
        {heading}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = route.page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo({ page: item.id } as AppRoute)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#1B4332] dark:bg-[#2D6A4F] text-white'
                  : 'text-[#1F2933] dark:text-[#D5E0D8] hover:bg-[#E8EFE9]/75 dark:hover:bg-[#1D3028]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="p-4 space-y-6 overflow-y-auto">
        <nav className="space-y-5" aria-label="Course Workspace Navigation">
          {renderSidebarNavGroup('Study Workspace', [
            { id: 'welcome', label: 'Welcome Page', icon: Home },
            { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
            { id: 'notes', label: 'Textbook Notes', icon: FileText },
            { id: 'lab', label: 'Digital Lab', icon: FlaskConical },
            { id: 'tutor', label: 'AI Doubt Assistant', icon: Bot }
          ])}

          {renderSidebarNavGroup('Exams & Formulas', [
            { id: 'exam-prep', label: 'Exam Centre', icon: ClipboardList },
            { id: 'quizzes', label: 'Assessments', icon: CheckCircle2 },
            { id: 'formulas', label: 'Formula Library', icon: Sigma }
          ])}
        </nav>

        {/* Five Syllabus Units */}
        <div className="space-y-2 pt-2 border-t border-[#DCE3DC] dark:border-[#253830]">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#52796F] dark:text-[#84A98C]">
            U24EC304 Syllabus Units
          </p>

          <div className="space-y-1">
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
                      className="p-1.5 text-[#52796F] hover:text-[#1B4332] dark:hover:text-[#52B788] cursor-pointer"
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
                          ? 'text-[#1B4332] dark:text-[#8CE0B0] bg-[#E8EFE9] dark:bg-[#1D3329]'
                          : 'text-[#1F2933] dark:text-[#DCE5DF] hover:bg-[#F2F5F1] dark:hover:bg-[#182822]'
                      }`}
                    >
                      <span className="truncate">
                        {unit.number}: {unit.title}
                      </span>
                      <span className="text-[11px] text-[#52796F] dark:text-[#84A98C] tabular-nums shrink-0">
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
                              className={`w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                                activeCh
                                  ? 'bg-[#E8EFE9] dark:bg-[#1D3329] text-[#1B4332] dark:text-[#8CE0B0] font-semibold'
                                  : 'text-[#52796F] dark:text-[#A4B8AC] hover:text-[#1F2933] dark:hover:text-white hover:bg-[#F2F5F1] dark:hover:bg-[#182822]'
                              }`}
                            >
                              <span className="truncate">
                                {ch.chapterNumber} {ch.title}
                              </span>
                              {done && (
                                <CheckCircle2 className="w-3 h-3 text-[#1B4332] dark:text-[#52B788] shrink-0" />
                              )}
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
      </div>

      {/* Workspace Footer Controls */}
      <div className="p-4 border-t border-[#DCE3DC] dark:border-[#253830] space-y-2 bg-[#FBFBF7] dark:bg-[#0D1512]">
        <button
          onClick={() => setPrefsOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-xs font-medium hover:border-[#1B4332] dark:hover:border-[#52B788] cursor-pointer"
        >
          <span>Study Environment &amp; Theme</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
        </button>

        {user ? (
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#E8EFE9]/70 dark:bg-[#182822] text-xs">
            <div className="min-w-0">
              <p className="font-semibold truncate text-[#1F2933] dark:text-[#EEF2EE]">
                {user.fullName}
              </p>
              <p className="text-[11px] text-[#52796F] dark:text-[#A4B8AC] truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => void logout()}
              className="p-1.5 rounded-lg text-[#52796F] hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigateTo({ page: 'auth', mode: 'login' })}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-xs font-semibold text-[#1B4332] dark:text-[#52B788] hover:border-[#1B4332] cursor-pointer"
          >
            <span>Login / Sync Progress</span>
            <LogIn className="w-3.5 h-3.5" />
          </button>
        )}

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-[#52796F] dark:text-[#A4B8AC] hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
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
              className="px-2.5 py-1.5 rounded-lg border border-[#DCE3DC] dark:border-[#253830] text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (route.page === 'auth') {
    return (
      <AuthView
        key={route.mode}
        initialMode={route.mode}
        backdropId={preferences.backdrop}
        onAuthSuccess={handleAuthSuccess}
        onNavigate={(next) => navigateTo(next)}
      />
    );
  }

  if (route.page === 'welcome') {
    return (
      <>
        <WelcomeFrontPage
          user={user}
          progress={progress}
          theme={theme}
          backdropId={preferences.backdrop}
          onToggleTheme={toggleTheme}
          onOpenPreferences={() => setPrefsOpen(true)}
          onNavigate={(next) => navigateTo(next)}
        />
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={(next) => navigateTo(next)}
        />
        <PreferencesModal
          open={prefsOpen}
          onClose={() => setPrefsOpen(false)}
          theme={theme}
          onSetTheme={setTheme}
          preferences={preferences}
          onSetBackdrop={setBackdrop}
          onSetReadingComfort={setReadingComfort}
        />
        <FloatingAssistantDrawer
          chat={assistantChat}
          currentRoute={route}
          onNavigate={(next) => navigateTo(next)}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#FBFBF7] dark:bg-[#0D1512] text-[#1F2933] dark:text-[#EEF2EE] ${
        preferences.readingComfort === 'relaxed' ? 'deco-reading-relaxed' : ''
      }`}
    >
      {/* Clean Three-Zone Top Header */}
      <header className="sticky top-0 z-30 h-14 border-b border-[#DCE3DC] dark:border-[#253830] bg-[#FBFBF7]/95 dark:bg-[#0D1512]/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between gap-4 no-print">
        {/* Zone 1: Brand + Mobile Menu */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-[#52796F] hover:bg-[#E8EFE9] dark:hover:bg-[#182822] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigateTo({ page: 'welcome' })}
            className="inline-flex items-center gap-2 text-base sm:text-lg font-extrabold tracking-tight text-[#1B4332] dark:text-[#52B788] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>DECO ACADEMY</span>
          </button>
        </div>

        {/* Zone 2: Single-line Primary Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#52796F] dark:text-[#A4B8AC]">
          {[
            { id: 'dashboard', label: 'Course Home' },
            { id: 'notes', label: 'Notes' },
            { id: 'exam-prep', label: 'Exam Centre' },
            { id: 'lab', label: 'Digital Lab' },
            { id: 'tutor', label: 'AI Assistant' }
          ].map((navItem) => (
            <button
              key={navItem.id}
              onClick={() => navigateTo({ page: navItem.id } as AppRoute)}
              className={`hover:text-[#1B4332] dark:hover:text-[#52B788] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                route.page === navItem.id
                  ? 'text-[#1B4332] dark:text-[#52B788] font-bold'
                  : ''
              }`}
            >
              {navItem.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Compact Search + Account */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSearchOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] dark:hover:border-[#52B788] text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
            <span>Search</span>
          </button>

          {user ? (
            <button
              onClick={() => setPrefsOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8EFE9] dark:bg-[#1D3329] text-xs font-semibold text-[#1B4332] dark:text-[#8CE0B0] whitespace-nowrap cursor-pointer"
              title={`Signed in as ${user.email}`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{user.fullName.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo({ page: 'auth', mode: 'login' })}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] dark:bg-[#2D6A4F] text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-68 shrink-0 border-r border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] sticky top-14 h-[calc(100vh-3.5rem)] no-print">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/55"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-50 w-72 max-w-[85vw] bg-white dark:bg-[#13201B] border-r border-[#DCE3DC] dark:border-[#253830] h-full">
              {renderSidebarContent()}
            </aside>
          </div>
        )}

        {/* Main Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* Visible Back Button, Breadcrumbs & Appearance Switcher */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#DCE3DC] dark:border-[#253830] no-print">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#52796F] dark:text-[#A4B8AC]">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] hover:border-[#1B4332] dark:hover:border-[#52B788] font-semibold text-[#1F2933] dark:text-[#EEF2EE] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 pl-1">
                {breadcrumbs.map((crumb, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="w-3 h-3 opacity-60" />}
                    {crumb.route ? (
                      <button
                        onClick={() => navigateTo(crumb.route!)}
                        className="hover:text-[#1B4332] dark:hover:text-[#52B788] hover:underline font-medium cursor-pointer"
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className="font-semibold text-[#1F2933] dark:text-[#EEF2EE]">
                        {crumb.label}
                      </span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrefsOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-xs font-medium hover:border-[#1B4332] dark:hover:border-[#52B788] transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
                <span className="hidden sm:inline">Preferences</span>
              </button>

              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DCE3DC] dark:border-[#253830] bg-white dark:bg-[#13201B] text-xs font-medium hover:border-[#1B4332] dark:hover:border-[#52B788] transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#D4A338]" />
                    <span>Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#1B4332]" />
                    <span>Dark</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {route.page === 'dashboard' && (
            <DashboardView
              user={user}
              progress={progress}
              backdropId={preferences.backdrop}
              onOpenPreferences={() => setPrefsOpen(true)}
              onNavigate={(next) => navigateTo(next)}
            />
          )}

          {route.page === 'unit' && (
            <UnitOverview
              unitId={route.unitId}
              progress={progress}
              onNavigate={(next) => navigateTo(next)}
              onToggleComplete={toggleChapterComplete}
              onToggleFavourite={toggleFavourite}
            />
          )}

          {route.page === 'chapter' && (
            <ChapterLearningView
              key={route.chapterId}
              chapterId={route.chapterId}
              progress={progress}
              onNavigate={(next) => navigateTo(next)}
              onToggleComplete={toggleChapterComplete}
              onToggleFavourite={toggleFavourite}
              onCheckAnswer={markCheckQuestionDone}
              onMarkSectionViewed={markLessonSectionViewed}
              onRecordMistake={recordMistake}
              onResolveMistake={resolveMistake}
            />
          )}

          {route.page === 'notes' && (
            <NotesView
              key={route.chapterId || 'notes-root'}
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
            <ExamPrepView
              initialUnitId={route.unitId}
              initialTab={route.tab}
              progress={progress}
              onToggleSaveExamQuestion={toggleSaveExamQuestion}
              onRecordAttempt={recordQuizAttempt}
              onRecordMistake={recordMistake}
              onResolveMistake={resolveMistake}
              onNavigate={(next) => navigateTo(next)}
            />
          )}

          {route.page === 'lab' && (
            <InteractiveLabView initialSimulator={route.simulator} />
          )}

          {route.page === 'quizzes' && (
            <QuizCenterView
              initialUnitId={route.unitId}
              attempts={progress.quizAttempts}
              onRecordAttempt={recordQuizAttempt}
              onRecordMistake={recordMistake}
              onResolveMistake={resolveMistake}
              onNavigate={(next) => navigateTo(next)}
            />
          )}

          {route.page === 'formulas' && (
            <FormulaLibraryView
              initialUnitId={route.unitId}
              onNavigate={(next) => navigateTo(next)}
            />
          )}

          {route.page === 'tutor' && (
            <AiTutorView
              key={`${route.unitId || 'all'}-${route.chapterId || ''}-${route.initialPrompt || ''}`}
              chat={assistantChat}
              progress={progress}
              initialUnitId={route.unitId}
              initialChapterId={route.chapterId}
              initialPrompt={route.initialPrompt}
              initialMode={route.mode}
              initialDifficulty={route.difficulty}
              onNavigate={(next) => navigateTo(next)}
            />
          )}

          {/* Clean Footer */}
          <footer className="mt-12 pt-6 border-t border-[#DCE3DC] dark:border-[#253830] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#52796F] dark:text-[#A4B8AC] no-print">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#1B4332] dark:text-[#52B788]" />
              <span>
                DECO ACADEMY · U24EC304 Digital Electronics &amp; Computer Organization
              </span>
            </span>
            <span>LIET(A), B.E.(AIML) · AICTE 2024–25 Syllabus</span>
          </footer>
        </main>
      </div>

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(next) => navigateTo(next)}
      />

      <PreferencesModal
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        theme={theme}
        onSetTheme={setTheme}
        preferences={preferences}
        onSetBackdrop={setBackdrop}
        onSetReadingComfort={setReadingComfort}
      />

      <FloatingAssistantDrawer
        chat={assistantChat}
        currentRoute={route}
        onNavigate={(next) => navigateTo(next)}
      />
    </div>
  );
}

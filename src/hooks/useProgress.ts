import { useState, useEffect, useCallback } from 'react';
import {
  MistakeRecord,
  QuizAttempt,
  ReadingComfort,
  RecentActivityItem,
  StudentUser,
  StudyBackdropId,
  StudyHistoryItem,
  StudyPreferences,
  UnitId,
  UserProgress
} from '../types/academic';

const PROGRESS_KEY = 'deco_academy_progress_v1';
const THEME_KEY = 'deco_academy_theme_v1';
const PREFS_KEY = 'deco_academy_prefs_v1';

const DEFAULT_PREFERENCES: StudyPreferences = {
  backdrop: 'mountains',
  readingComfort: 'standard'
};

const DEFAULT_PROGRESS: UserProgress = {
  completedChapters: [],
  favouriteChapters: [],
  checkedUnderstanding: {},
  lessonSectionsViewed: {},
  savedExamQuestions: [],
  mistakes: [],
  quizAttempts: [],
  recentActivity: [],
  studyHistory: [],
  lastVisitedChapterId: null
};

export function useProgress() {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          lessonSectionsViewed: parsed.lessonSectionsViewed || {},
          savedExamQuestions: parsed.savedExamQuestions || [],
          mistakes: parsed.mistakes || [],
          studyHistory: parsed.studyHistory || []
        };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore storage errors
    }
    return 'light';
  });

  const [preferences, setPreferences] = useState<StudyPreferences>(() => {
    try {
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          backdrop: parsed.backdrop || 'mountains',
          readingComfort: parsed.readingComfort || 'standard'
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PREFERENCES;
  });

  // Restore persistent session from backend cookie on mount
  useEffect(() => {
    let active = true;
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((data) => {
        if (!active) return;
        if (data?.user) {
          setUser(data.user);
          if (data.user.preferences) {
            setPreferences({
              backdrop: data.user.preferences.backdrop || 'mountains',
              readingComfort: data.user.preferences.readingComfort || 'standard'
            });
          }
          if (data.user.progress) {
            setProgress((prev) => ({
              ...DEFAULT_PROGRESS,
              ...prev,
              ...data.user.progress
            }));
          }
        }
      })
      .catch(() => {
        // ignore network hiccup on cold load
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Cloud-sync preferences and progress whenever signed in
  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => {
      fetch('/api/auth/sync', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, progress })
      }).catch(() => {
        // silent background sync
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [user, preferences, progress]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setBackdrop = useCallback((backdrop: StudyBackdropId) => {
    setPreferences((prev) => ({ ...prev, backdrop }));
  }, []);

  const setReadingComfort = useCallback((readingComfort: ReadingComfort) => {
    setPreferences((prev) => ({ ...prev, readingComfort }));
  }, []);

  const handleAuthSuccess = useCallback(
    (authedUser: StudentUser & { progress?: Partial<UserProgress> | null }) => {
      setUser({
        id: authedUser.id,
        fullName: authedUser.fullName,
        email: authedUser.email,
        preferences: authedUser.preferences
      });
      if (authedUser.preferences) {
        setPreferences({
          backdrop: authedUser.preferences.backdrop || 'mountains',
          readingComfort: authedUser.preferences.readingComfort || 'standard'
        });
      }
      if (authedUser.progress) {
        setProgress((prev) => ({
          ...DEFAULT_PROGRESS,
          ...prev,
          ...authedUser.progress
        }));
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const appendHistory = (
    prevHistory: StudyHistoryItem[],
    entry: Omit<StudyHistoryItem, 'id' | 'timestamp'>
  ): StudyHistoryItem[] => {
    const newItem: StudyHistoryItem = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    return [newItem, ...prevHistory].slice(0, 40);
  };

  const toggleChapterComplete = useCallback(
    (chapterId: string, chapterTitle: string, unitNumber: string) => {
      setProgress((prev) => {
        const exists = prev.completedChapters.includes(chapterId);
        const completedChapters = exists
          ? prev.completedChapters.filter((id) => id !== chapterId)
          : [...prev.completedChapters, chapterId];

        const activityEntry: RecentActivityItem = {
          chapterId,
          chapterTitle,
          unitNumber,
          action: exists ? 'studied' : 'completed',
          timestamp: new Date().toISOString()
        };

        const recentActivity = [
          activityEntry,
          ...prev.recentActivity.filter(
            (a) => !(a.chapterId === chapterId && a.action === activityEntry.action)
          )
        ].slice(0, 12);

        const studyHistory = appendHistory(prev.studyHistory, {
          area: 'lesson',
          title: `${unitNumber} · ${chapterTitle}`,
          chapterId,
          detail: exists ? 'Unmarked completion' : 'Completed lesson'
        });

        return {
          ...prev,
          completedChapters,
          recentActivity,
          studyHistory,
          lastVisitedChapterId: chapterId
        };
      });
    },
    []
  );

  const toggleFavourite = useCallback((chapterId: string) => {
    setProgress((prev) => {
      const exists = prev.favouriteChapters.includes(chapterId);
      const favouriteChapters = exists
        ? prev.favouriteChapters.filter((id) => id !== chapterId)
        : [...prev.favouriteChapters, chapterId];
      return { ...prev, favouriteChapters };
    });
  }, []);

  const toggleSaveExamQuestion = useCallback((questionId: string) => {
    setProgress((prev) => {
      const exists = prev.savedExamQuestions.includes(questionId);
      const savedExamQuestions = exists
        ? prev.savedExamQuestions.filter((id) => id !== questionId)
        : [...prev.savedExamQuestions, questionId];
      return { ...prev, savedExamQuestions };
    });
  }, []);

  const markLessonSectionViewed = useCallback((chapterId: string, sectionKey: string) => {
    setProgress((prev) => {
      const current = prev.lessonSectionsViewed[chapterId] || [];
      if (current.includes(sectionKey)) return prev;
      return {
        ...prev,
        lessonSectionsViewed: {
          ...prev.lessonSectionsViewed,
          [chapterId]: [...current, sectionKey]
        }
      };
    });
  }, []);

  const recordChapterVisit = useCallback(
    (
      chapterId: string,
      chapterTitle: string,
      unitNumber: string,
      action: 'studied' | 'notes' = 'studied'
    ) => {
      setProgress((prev) => {
        const recentActivity = [
          {
            chapterId,
            chapterTitle,
            unitNumber,
            action,
            timestamp: new Date().toISOString()
          },
          ...prev.recentActivity.filter((a) => a.chapterId !== chapterId)
        ].slice(0, 12);

        const currentSections = prev.lessonSectionsViewed[chapterId] || [];
        const nextSections = currentSections.includes('intro')
          ? currentSections
          : [...currentSections, 'intro'];

        const studyHistory = appendHistory(prev.studyHistory, {
          area: action === 'notes' ? 'notes' : 'lesson',
          title: `${unitNumber} · ${chapterTitle}`,
          chapterId,
          detail: action === 'notes' ? 'Reviewed revision notes' : 'Opened lesson'
        });

        return {
          ...prev,
          lastVisitedChapterId: chapterId,
          recentActivity,
          studyHistory,
          lessonSectionsViewed: {
            ...prev.lessonSectionsViewed,
            [chapterId]: nextSections
          }
        };
      });
    },
    []
  );

  const markCheckQuestionDone = useCallback((chapterId: string, questionIndex: number) => {
    setProgress((prev) => {
      const current = prev.checkedUnderstanding[chapterId] || [];
      if (current.includes(questionIndex)) return prev;
      return {
        ...prev,
        checkedUnderstanding: {
          ...prev.checkedUnderstanding,
          [chapterId]: [...current, questionIndex]
        }
      };
    });
  }, []);

  const recordMistake = useCallback(
    (entry: Omit<MistakeRecord, 'id' | 'timestamp' | 'resolved'>) => {
      setProgress((prev) => {
        const existingIdx = prev.mistakes.findIndex(
          (m) => m.questionId === entry.questionId && !m.resolved
        );
        const newRecord: MistakeRecord = {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toISOString(),
          resolved: false
        };
        const nextMistakes =
          existingIdx >= 0
            ? prev.mistakes.map((m, i) => (i === existingIdx ? newRecord : m))
            : [newRecord, ...prev.mistakes];

        return {
          ...prev,
          mistakes: nextMistakes.slice(0, 60)
        };
      });
    },
    []
  );

  const resolveMistake = useCallback((questionId: string) => {
    setProgress((prev) => ({
      ...prev,
      mistakes: prev.mistakes.map((m) =>
        m.questionId === questionId ? { ...m, resolved: true } : m
      )
    }));
  }, []);

  const recordQuizAttempt = useCallback((attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => {
    setProgress((prev) => ({
      ...prev,
      quizAttempts: [
        {
          ...attempt,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString()
        },
        ...prev.quizAttempts
      ].slice(0, 30),
      studyHistory: appendHistory(prev.studyHistory, {
        area: 'quiz',
        title: attempt.title,
        unitId: attempt.unitId === 'mixed' ? undefined : (attempt.unitId as UnitId),
        detail: `Scored ${attempt.score}/${attempt.total} (${attempt.percentage}%)`
      })
    }));
  }, []);

  const recordStudyEvent = useCallback(
    (entry: Omit<StudyHistoryItem, 'id' | 'timestamp'>) => {
      setProgress((prev) => ({
        ...prev,
        studyHistory: appendHistory(prev.studyHistory, entry)
      }));
    },
    []
  );

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    user,
    authChecked,
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
  };
}

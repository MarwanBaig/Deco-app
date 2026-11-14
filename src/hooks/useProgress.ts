import { useState, useEffect, useCallback } from 'react';
import { QuizAttempt, RecentActivityItem, UserProgress } from '../types/academic';

const PROGRESS_KEY = 'deco_academy_progress_v1';
const THEME_KEY = 'deco_academy_theme_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedChapters: [],
  favouriteChapters: [],
  checkedUnderstanding: {},
  quizAttempts: [],
  recentActivity: [],
  lastVisitedChapterId: null
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
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
    return 'dark';
  });

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
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

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

        return {
          ...prev,
          completedChapters,
          recentActivity,
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

  const recordChapterVisit = useCallback(
    (chapterId: string, chapterTitle: string, unitNumber: string, action: 'studied' | 'notes' = 'studied') => {
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

        return {
          ...prev,
          lastVisitedChapterId: chapterId,
          recentActivity
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
      ].slice(0, 30)
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress,
    theme,
    toggleTheme,
    toggleChapterComplete,
    toggleFavourite,
    recordChapterVisit,
    markCheckQuestionDone,
    recordQuizAttempt,
    resetProgress
  };
}

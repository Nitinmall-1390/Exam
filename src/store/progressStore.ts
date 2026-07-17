import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExamAttempt, UserProfile } from '../types';

interface ProgressState {
  attempts: ExamAttempt[];
  globalBookmarks: number[];   // questionIds bookmarked globally
  profile: UserProfile | null;
  hasSetup: boolean;

  // Actions
  saveAttempt: (attempt: ExamAttempt) => void;
  toggleGlobalBookmark: (questionId: number) => void;
  setProfile: (profile: UserProfile) => void;
  resetProgress: () => void;
  getAttemptsForMock: (mockId: number) => ExamAttempt[];
  getBestScore: (mockId: number) => number | null;
  getChapterAccuracy: () => Record<string, { correct: number; total: number }>;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      attempts: [],
      globalBookmarks: [],
      profile: null,
      hasSetup: false,

      saveAttempt: (attempt) => set((state) => ({
        attempts: [attempt, ...state.attempts]
      })),

      toggleGlobalBookmark: (questionId) => set((state) => {
        const isBookmarked = state.globalBookmarks.includes(questionId);
        return {
          globalBookmarks: isBookmarked
            ? state.globalBookmarks.filter((id) => id !== questionId)
            : [...state.globalBookmarks, questionId]
        };
      }),

      setProfile: (profile) => set({
        profile,
        hasSetup: true,
      }),

      resetProgress: () => set({
        attempts: [],
        globalBookmarks: [],
      }),

      getAttemptsForMock: (mockId) => {
        return get().attempts.filter(a => a.mockTestId === mockId);
      },

      getBestScore: (mockId) => {
        const mockAttempts = get().attempts.filter(a => a.mockTestId === mockId);
        if (mockAttempts.length === 0) return null;
        return Math.max(...mockAttempts.map(a => a.percentage));
      },

      getChapterAccuracy: () => {
        // Returns per-chapter accuracy across all attempts
        // Each attempt stores answers keyed by questionId
        // Since we don't store chapter per question in attempt, return empty
        // (full chapter stats are computed in the component from questions + attempts)
        return {};
      },
    }),
    {
      name: 'jceceb-nursing-progress-v2',
    }
  )
);

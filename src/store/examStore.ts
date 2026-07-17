import { create } from 'zustand';

interface ExamState {
  activeMockId: number | null;
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> selected option ('A', 'B', 'C', 'D')
  markedForReview: number[]; // array of questionIds
  bookmarks: number[]; // array of questionIds
  timeSpent: Record<number, number>; // questionId -> seconds spent
  timeLeft: number; // seconds remaining (120 minutes = 7200 seconds)
  isExamSubmitted: boolean;
  
  // Actions
  startExam: (mockId: number) => void;
  selectOption: (questionId: number, option: string) => void;
  clearResponse: (questionId: number) => void;
  toggleMarkForReview: (questionId: number) => void;
  toggleBookmark: (questionId: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  updateTimeSpent: (questionId: number, seconds: number) => void;
  decrementTimeLeft: () => void;
  submitExam: () => void;
  resetExam: () => void;
}

const TOTAL_EXAM_TIME = 120 * 60; // 120 minutes in seconds (7200s)

export const useExamStore = create<ExamState>((set) => ({
  activeMockId: null,
  currentQuestionIndex: 0,
  answers: {},
  markedForReview: [],
  bookmarks: [],
  timeSpent: {},
  timeLeft: TOTAL_EXAM_TIME,
  isExamSubmitted: false,

  startExam: (mockId) => set({
    activeMockId: mockId,
    currentQuestionIndex: 0,
    answers: {},
    markedForReview: [],
    timeSpent: {},
    timeLeft: TOTAL_EXAM_TIME,
    isExamSubmitted: false,
  }),

  selectOption: (questionId, option) => set((state) => ({
    answers: { ...state.answers, [questionId]: option }
  })),

  clearResponse: (questionId) => set((state) => {
    const newAnswers = { ...state.answers };
    delete newAnswers[questionId];
    return { answers: newAnswers };
  }),

  toggleMarkForReview: (questionId) => set((state) => {
    const isMarked = state.markedForReview.includes(questionId);
    return {
      markedForReview: isMarked
        ? state.markedForReview.filter((id) => id !== questionId)
        : [...state.markedForReview, questionId]
    };
  }),

  toggleBookmark: (questionId) => set((state) => {
    const isBookmarked = state.bookmarks.includes(questionId);
    return {
      bookmarks: isBookmarked
        ? state.bookmarks.filter((id) => id !== questionId)
        : [...state.bookmarks, questionId]
    };
  }),

  nextQuestion: () => set((state) => ({
    currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, 149)
  })),

  prevQuestion: () => set((state) => ({
    currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
  })),

  goToQuestion: (index) => set({
    currentQuestionIndex: index
  }),

  updateTimeSpent: (questionId, seconds) => set((state) => ({
    timeSpent: {
      ...state.timeSpent,
      [questionId]: (state.timeSpent[questionId] || 0) + seconds
    }
  })),

  decrementTimeLeft: () => set((state) => ({
    timeLeft: Math.max(state.timeLeft - 1, 0)
  })),

  submitExam: () => set({
    isExamSubmitted: true
  }),

  resetExam: () => set({
    activeMockId: null,
    currentQuestionIndex: 0,
    answers: {},
    markedForReview: [],
    timeSpent: {},
    timeLeft: TOTAL_EXAM_TIME,
    isExamSubmitted: false,
  })
}));

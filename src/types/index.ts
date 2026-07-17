export interface Question {
  id: number;
  mock: number;
  subject: 'Biology' | 'Physics' | 'Chemistry';
  chapter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: 'Conceptual' | 'Application' | 'Statement-Based' | 'Assertion-Reason' | 'Clinical' | 'NCERT Direct' | 'Numerical';
  question: string;
  options: string[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  whyOthersWrong: string;
  ncertReference: string;
  trick: string;
  estimatedTime: number; // seconds
  tags: string[];
}

export interface ExamAttempt {
  id: string;
  mockTestId: number;
  answers: Record<number, string>;       // questionId → selectedOption
  markedForReview: number[];             // questionIds
  bookmarks: number[];                   // questionIds
  timeSpent: Record<number, number>;     // questionId → seconds
  totalTimeTaken: number;                // seconds
  score: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  percentage: number;
  submittedAt: string;                   // ISO timestamp
}

export interface UserProfile {
  name: string;
  state: string;
  targetYear: string;
  createdAt: string;
}

export interface SubjectAccuracy {
  Biology: number;
  Chemistry: number;
  Physics: number;
}

export interface UserStats {
  completedTests: number;
  averageScore: number;
  averageAccuracy: number;
  totalTimeSpent: number; // seconds
  subjectAccuracy: SubjectAccuracy;
  chapterAccuracy: Record<string, number>; // chapter → % correct
}

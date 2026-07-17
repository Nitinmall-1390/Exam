import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import { BookOpen, Calendar, ChevronRight, Award, UserCheck, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { attempts, profile } = useProgressStore();

  const handleStartExam = (mockId: number) => {
    navigate(`/exam/${mockId}`);
  };

  const handleViewSolutions = (mockId: number, attemptId: string) => {
    navigate(`/solutions/${mockId}/${attemptId}`);
  };

  // Calculate metrics
  const completedCount = attempts.length;
  const averageScore = completedCount > 0
    ? (attempts.reduce((sum, a) => sum + a.score, 0) / completedCount).toFixed(1)
    : '0.0';
  const averageAccuracy = completedCount > 0
    ? (attempts.reduce((sum, a) => sum + a.percentage, 0) / completedCount).toFixed(1)
    : '0.0';
  const totalTimeInSeconds = attempts.reduce((sum, a) => sum + a.totalTimeTaken, 0);
  const totalHours = (totalTimeInSeconds / 3600).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Welcome back, {profile?.name ?? 'Nursing Aspirant'}!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track your performance and attempt full-length practice mock papers.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 px-3 py-1.5 rounded-xl font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Academic Year: 2026-27</span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Completed</p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{completedCount} Tests</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Avg Score</p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{averageScore} / 150</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Avg Accuracy</p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{averageAccuracy}%</h4>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold">Time Spent</p>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{totalHours} hrs</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mock test series */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Select Mock Test</h2>
          
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mockId) => {
            // Find attempts for this mock id
            const mockAttempts = attempts.filter(a => a.mockTestId === mockId);
            const isCompleted = mockAttempts.length > 0;
            const latestAttempt = isCompleted ? mockAttempts[0] : null;

            return (
              <div
                key={mockId}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-slate-800 dark:to-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-slate-700/50 flex-shrink-0">
                    <span className="font-extrabold text-sm">M{mockId}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Full-Length Mock Test {mockId}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[11px] font-semibold text-slate-500">
                      <span>150 MCQs</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span>120 Mins</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-indigo-600 dark:text-indigo-400">Bio, Chem, Phys</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap items-center gap-3">
                  {latestAttempt ? (
                    <div className="w-full sm:w-auto flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Latest Score</p>
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          {latestAttempt.score.toFixed(2)}/150 ({latestAttempt.percentage}%)
                        </p>
                      </div>
                      <button
                        onClick={() => handleViewSolutions(mockId, latestAttempt.id)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100/40 dark:hover:bg-indigo-950/30 text-xs font-bold transition-all"
                      >
                        Solutions
                      </button>
                      <button
                        onClick={() => handleStartExam(mockId)}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                      >
                        Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartExam(mockId)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      Attempt Test
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar: Leaderboard & Info */}
        <div className="space-y-6">
            {completedCount > 0 && (
              <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-600/5 rounded-bl-[50px] pointer-events-none" />
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Personal Best</h3>
                </div>
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-800/40 text-center">
                  <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Highest Score</p>
                  <h4 className="text-lg font-black text-indigo-700 dark:text-indigo-300 mt-0.5">
                    {Math.max(...attempts.map(a => a.score)).toFixed(2)} / 150
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">Based on {completedCount} mock attempts</p>
                </div>
              </div>
            )}

          {/* Syllabus Details card */}
          <div className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/40 space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-500">Exam Blueprint</h3>
            
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between font-medium">
                <span>Biology</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">50 Questions</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Physics</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">50 Questions</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Chemistry</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">50 Questions</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Negative marking applies: each correct answer yields +1.0 mark, while an incorrect response results in -0.25 mark. Unanswered questions do not affect score.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

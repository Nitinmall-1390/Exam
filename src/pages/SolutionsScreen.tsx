import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import type { Question } from '../types';
import questionsData from '../data/questions.json';
import { Check, X, Bookmark, BookmarkCheck, ArrowLeft, BarChart3, HelpCircle, FileText, Lightbulb, Compass } from 'lucide-react';

export const SolutionsScreen: React.FC = () => {
  const { mockId, attemptId } = useParams<{ mockId: string; attemptId: string }>();
  const navigate = useNavigate();
  const mockTestId = parseInt(mockId || '1');

  const { attempts, globalBookmarks, toggleGlobalBookmark } = useProgressStore();

  // Find corresponding attempt
  const attempt = attempts.find((a) => a.id === attemptId);

  // Filter questions for this mock
  const questionsList = (questionsData as Question[]).filter(
    (q) => q.mock === mockTestId
  );

  // State for filtering
  const [activeFilter, setActiveFilter] = useState<'all' | 'correct' | 'wrong' | 'skipped' | 'marked'>('all');

  if (!attempt) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Attempt Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">We could not load the solutions for this exam attempt.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Filter logic
  const filteredQuestions = questionsList.filter((q) => {
    const userAns = attempt.answers[q.id];
    const isCorrect = userAns === q.correctAnswer;
    const isMarked = attempt.markedForReview.includes(q.id);

    if (activeFilter === 'correct') return userAns && isCorrect;
    if (activeFilter === 'wrong') return userAns && !isCorrect;
    if (activeFilter === 'skipped') return !userAns;
    if (activeFilter === 'marked') return isMarked;
    return true; // 'all'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Back button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button
          onClick={() => navigate('/analytics')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <BarChart3 className="w-4 h-4" />
          Detailed Performance Analytics
        </button>
      </div>

      {/* Attempt summary banner */}
      <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
            Mock Test {mockTestId} Solutions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Attempted on {new Date(attempt.submittedAt).toLocaleDateString()} • Time Taken: {Math.floor(attempt.totalTimeTaken / 60)} mins
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-850/40 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold">Raw Score</span>
            <h4 className="text-lg font-black text-indigo-700 dark:text-indigo-300">{attempt.score.toFixed(2)}</h4>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-850/40 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold">Accuracy</span>
            <h4 className="text-lg font-black text-emerald-700 dark:text-emerald-300">{attempt.percentage}%</h4>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-850/40 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-widest font-bold">Incorrect</span>
            <h4 className="text-lg font-black text-rose-700 dark:text-rose-300">{attempt.wrongCount}</h4>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3.5 mb-8">
        {[
          { key: 'all', label: `All (${questionsList.length})` },
          { key: 'correct', label: `Correct (${attempt.correctCount})` },
          { key: 'wrong', label: `Incorrect (${attempt.wrongCount})` },
          { key: 'skipped', label: `Skipped (${attempt.skippedCount})` },
          { key: 'marked', label: `Marked (${attempt.markedForReview.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200
              ${activeFilter === tab.key
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Solutions list */}
      <div className="space-y-8">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 glass-effect rounded-3xl">
            No questions matching the selected filter.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const indexInMock = questionsList.findIndex((item) => item.id === q.id) + 1;
            const userAns = attempt.answers[q.id];
            const isCorrect = userAns === q.correctAnswer;
            const isBookmarked = globalBookmarks.includes(q.id);
            const timeSpentSec = attempt.timeSpent[q.id] || 0;

            return (
              <div
                key={q.id}
                className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden"
              >
                {/* Header indicators */}
                <div className="flex flex-wrap gap-2 items-center mb-5">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-bold text-white
                    ${isCorrect ? 'bg-emerald-600' : userAns ? 'bg-rose-500' : 'bg-slate-500'}
                  `}>
                    {userAns ? (isCorrect ? 'Correct' : 'Incorrect') : 'Skipped'}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[11px] font-bold">
                    Q.{indexInMock}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[11px] font-semibold">
                    {q.subject}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[11px] font-semibold">
                    {q.chapter}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[11px] font-semibold">
                    Spent: {timeSpentSec}s
                  </span>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleGlobalBookmark(q.id)}
                    className="ml-auto p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Question */}
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                  {q.question}
                </p>

                {/* Options list */}
                <div className="grid grid-cols-1 gap-3.5 mb-6 max-w-3xl">
                  {q.options.map((opt, oIdx) => {
                    const optKey = String.fromCharCode(65 + oIdx);
                    const isOptionCorrect = q.correctAnswer === optKey;
                    const isOptionSelected = userAns === optKey;

                    let borderClass = 'border-slate-200 dark:border-slate-800';
                    let bgClass = '';
                    let badgeIcon = null;

                    if (isOptionCorrect) {
                      borderClass = 'border-emerald-500 dark:border-emerald-500/70';
                      bgClass = 'bg-emerald-50/40 dark:bg-emerald-950/15';
                      badgeIcon = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
                    } else if (isOptionSelected) {
                      borderClass = 'border-rose-500 dark:border-rose-500/70';
                      bgClass = 'bg-rose-50/40 dark:bg-rose-950/15';
                      badgeIcon = <X className="w-4 h-4 text-rose-500" />;
                    }

                    return (
                      <div
                        key={optKey}
                        className={`flex items-start p-4 rounded-2xl border-2 transition-colors ${borderClass} ${bgClass}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0
                          ${isOptionCorrect
                            ? 'bg-emerald-600 text-white'
                            : isOptionSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {optKey}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-tight mr-4 flex-1">
                          {opt}
                        </span>
                        {badgeIcon}
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Solution Area */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
                  
                  {/* Correct Solution */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Explanation</h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 mt-1 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Why other options incorrect */}
                  {q.whyOthersWrong && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Incorrect Options Rationale</h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-405 mt-1 leading-relaxed">
                          {q.whyOthersWrong}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* NCERT Concept */}
                  {q.ncertReference && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">NCERT Reference</h4>
                        <p className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-400 font-medium mt-1">
                          {q.ncertReference}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Memory Trick */}
                  {q.trick && (
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">Memory Trick / Tip</h4>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                          {q.trick}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

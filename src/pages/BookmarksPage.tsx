import React, { useState } from 'react';
import { useProgressStore } from '../store/progressStore';
import type { Question } from '../types';
import questionsData from '../data/questions.json';
import { Bookmark, BookmarkCheck, Search, HelpCircle, FileText, Lightbulb, Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { globalBookmarks, toggleGlobalBookmark } = useProgressStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Resolve bookmarked questions from JSON database
  const bookmarkedQuestions = (questionsData as Question[]).filter((q) =>
    globalBookmarks.includes(q.id)
  );

  // Filter based on search query
  const filteredBookmarks = bookmarkedQuestions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20">
      
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            Bookmarked Questions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review your collection of saved questions, formulas, and NCERT study notes.
          </p>
        </div>
        <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100/30">
          {globalBookmarks.length} Bookmarks
        </span>
      </div>

      {/* Search Bar */}
      {globalBookmarks.length > 0 && (
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-405" />
          <input
            type="text"
            placeholder="Search bookmarks by topic, concept, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      )}

      {/* Bookmarks List */}
      <div className="space-y-6">
        {globalBookmarks.length === 0 ? (
          <div className="p-16 text-center border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 rounded-3xl">
            <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-sm text-slate-700 dark:text-slate-400">Your Bookmark Binder is Empty</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Save key questions using the bookmark icon on active mock tests or post-test review pages.
            </p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">
            No bookmarks match your search query. Try typing another concept.
          </p>
        ) : (
          filteredBookmarks.map((q) => (
            <div
              key={q.id}
              className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden"
            >
              {/* Top Meta info */}
              <div className="flex flex-wrap gap-2 items-center mb-5">
                <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                  Mock {q.mock} • Q.{q.id % 150 === 0 ? 150 : q.id % 150}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-semibold">
                  {q.subject}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-[10px] font-semibold">
                  {q.chapter}
                </span>

                {/* Remove bookmark */}
                <button
                  onClick={() => toggleGlobalBookmark(q.id)}
                  className="ml-auto p-2 rounded-xl text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Remove Bookmark"
                >
                  <BookmarkCheck className="w-5 h-5" />
                </button>
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-6 leading-relaxed">
                {q.question}
              </p>

              {/* Options list */}
              <div className="grid grid-cols-1 gap-3.5 mb-6 max-w-3xl">
                {q.options.map((opt, oIdx) => {
                  const optKey = String.fromCharCode(65 + oIdx);
                  const isOptionCorrect = q.correctAnswer === optKey;

                  return (
                    <div
                      key={optKey}
                      className={`flex items-start p-4 rounded-2xl border-2
                        ${isOptionCorrect
                          ? 'border-emerald-500 bg-emerald-50/20 dark:border-emerald-550/15'
                          : 'border-slate-200 dark:border-slate-800'
                        }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0
                        ${isOptionCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                      >
                        {optKey}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-tight">
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Solutions */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
                
                {/* Explanation */}
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

                {/* Incorrect Rationales */}
                {q.whyOthersWrong && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-105 text-slate-500 flex items-center justify-center flex-shrink-0 dark:bg-slate-800">
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

                {/* NCERT Link */}
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

                {/* Mnemonic Trick */}
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
          ))
        )}
      </div>

    </div>
  );
};

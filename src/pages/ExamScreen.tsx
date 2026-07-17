import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import { useProgressStore } from '../store/progressStore';
import type { Question, ExamAttempt } from '../types';
import questionsData from '../data/questions.json';
import { Clock, CheckCircle2, AlertTriangle, Bookmark, ArrowLeft, ArrowRight, X, Menu } from 'lucide-react';

export const ExamScreen: React.FC = () => {
  const { mockId } = useParams<{ mockId: string }>();
  const navigate = useNavigate();
  const mockTestId = parseInt(mockId || '1');

  // Zustand Store
  const {
    activeMockId,
    currentQuestionIndex,
    answers,
    markedForReview,
    bookmarks,
    timeLeft,
    isExamSubmitted,
    startExam,
    selectOption,
    clearResponse,
    toggleMarkForReview,
    toggleBookmark,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    decrementTimeLeft,
    submitExam,
    updateTimeSpent,
    resetExam
  } = useExamStore();

  const { saveAttempt, toggleGlobalBookmark, globalBookmarks } = useProgressStore();

  // Local state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showPaletteMobile, setShowPaletteMobile] = useState(false);
  
  // Track time spent per question
  const lastTimeRef = useRef<number>(Date.now());

  // Filter questions for the active mock test
  const questionsList = (questionsData as Question[]).filter(
    (q) => q.mock === mockTestId
  );

  const currentQuestion = questionsList[currentQuestionIndex];

  // Initialize exam on mount
  useEffect(() => {
    startExam(mockTestId);
    lastTimeRef.current = Date.now();
    
    return () => {
      // Clean up if component unmounts
      resetExam();
    };
  }, [mockTestId]);

  // Timer Tick
  useEffect(() => {
    if (isExamSubmitted || activeMockId === null) return;

    const timer = setInterval(() => {
      // Record time spent on current question
      const now = Date.now();
      const elapsed = Math.round((now - lastTimeRef.current) / 1000);
      if (elapsed > 0 && currentQuestion) {
        updateTimeSpent(currentQuestion.id, elapsed);
      }
      lastTimeRef.current = now;

      // Decrement main timer
      if (timeLeft <= 1) {
        clearInterval(timer);
        handleAutoSubmit();
      } else {
        decrementTimeLeft();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isExamSubmitted, activeMockId, currentQuestionIndex]);

  // Track time when swapping questions
  const handleGoToQuestion = (index: number) => {
    const now = Date.now();
    const elapsed = Math.round((now - lastTimeRef.current) / 1000);
    if (elapsed > 0 && currentQuestion) {
      updateTimeSpent(currentQuestion.id, elapsed);
    }
    lastTimeRef.current = now;
    goToQuestion(index);
  };

  const handleNext = () => {
    const now = Date.now();
    const elapsed = Math.round((now - lastTimeRef.current) / 1000);
    if (elapsed > 0 && currentQuestion) {
      updateTimeSpent(currentQuestion.id, elapsed);
    }
    lastTimeRef.current = now;
    nextQuestion();
  };

  const handlePrev = () => {
    const now = Date.now();
    const elapsed = Math.round((now - lastTimeRef.current) / 1000);
    if (elapsed > 0 && currentQuestion) {
      updateTimeSpent(currentQuestion.id, elapsed);
    }
    lastTimeRef.current = now;
    prevQuestion();
  };

  // Auto submit on time out
  const handleAutoSubmit = () => {
    alert("Time is up! Your exam will be submitted automatically.");
    processSubmission();
  };

  // Calculate score and build Attempt
  const processSubmission = () => {
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questionsList.forEach((q) => {
      const selected = answers[q.id];
      if (selected) {
        if (selected === q.correctAnswer) {
          correctCount++;
          score += 1.0;
        } else {
          wrongCount++;
          score -= 0.25; // Negative marking
        }
      } else {
        skippedCount++;
      }
    });

    // Ensure score is not negative
    const finalScore = score;
    const rawPercentage = Math.round((correctCount / questionsList.length) * 100);

    const attempt: ExamAttempt = {
      id: Math.random().toString(36).substring(2, 11),
      mockTestId,
      answers,
      markedForReview,
      bookmarks,
      timeSpent: useExamStore.getState().timeSpent,
      totalTimeTaken: 7200 - timeLeft, // 2 hours - time remaining
      score: finalScore,
      correctCount,
      wrongCount,
      skippedCount,
      percentage: rawPercentage,
      submittedAt: new Date().toISOString()
    };

    saveAttempt(attempt);
    submitExam();
    
    // Redirect to Solutions Review page
    navigate(`/solutions/${mockTestId}/${attempt.id}`);
  };

  // Helper formats
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questionsList.length === 0 || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500">
        Loading exam questions...
      </div>
    );
  }

  // Count question stats for palette summary
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.length;
  const unansweredCount = questionsList.length - answeredCount;

  // Decide class for question palette indicator
  const getPaletteBtnClass = (qId: number, idx: number) => {
    const isCurrent = idx === currentQuestionIndex;
    const isAnswered = !!answers[qId];
    const isMarked = markedForReview.includes(qId);

    let base = "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ";

    if (isCurrent) {
      base += "border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/30 ";
    } else {
      base += "border-slate-200/60 dark:border-slate-800/60 ";
    }

    if (isMarked && isAnswered) {
      return base + "bg-purple-600 text-white border-purple-600 hover:bg-purple-700";
    }
    if (isMarked) {
      return base + "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-850 hover:bg-violet-200 dark:hover:bg-violet-900/50";
    }
    if (isAnswered) {
      return base + "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700";
    }
    // Visited but not answered (active answers map has no key, but if it is in timeSpent, it's visited)
    const isVisited = useExamStore.getState().timeSpent[qId] > 0;
    if (isVisited) {
      return base + "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50 hover:bg-rose-250";
    }

    return base + "bg-slate-100/50 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800";
  };

  const currentSelection = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      
      {/* Exam Header */}
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm text-slate-800 dark:text-white">
            JCECEB Mock {mockTestId}
          </span>
          <span className="hidden sm:inline px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
            Full-Length
          </span>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm font-bold text-slate-700 dark:text-slate-400">
            <Clock className={`w-4 h-4 ${timeLeft < 600 ? 'text-rose-500 animate-pulse' : 'text-indigo-500'}`} />
            <span className={timeLeft < 600 ? 'text-rose-500' : ''}>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowExitModal(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Quit Exam"
          >
            <X className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-colors"
          >
            Submit
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row relative">
        
        {/* Left Side: Question Pane */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto mb-16 md:mb-0">
          <div>
            {/* Badges bar */}
            <div className="flex flex-wrap gap-2 items-center mb-6">
              <span className="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                Q.{currentQuestionIndex + 1} of 150
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-semibold">
                {currentQuestion.subject}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-semibold">
                {currentQuestion.chapter}
              </span>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border
                ${currentQuestion.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40' : ''}
                ${currentQuestion.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40' : ''}
                ${currentQuestion.difficulty === 'Hard' ? 'bg-rose-50 text-rose-600 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40' : ''}
              `}>
                {currentQuestion.difficulty}
              </span>

              {/* Bookmark Toggle */}
              <button
                onClick={() => {
                  toggleBookmark(currentQuestion.id);
                  toggleGlobalBookmark(currentQuestion.id);
                }}
                className={`ml-auto p-2 rounded-xl border transition-all duration-200
                  ${bookmarks.includes(currentQuestion.id) || globalBookmarks.includes(currentQuestion.id)
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : 'text-slate-400 border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                title="Bookmark Question"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Question Text */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3.5 max-w-3xl">
              {currentQuestion.options.map((opt, i) => {
                const optKey = String.fromCharCode(65 + i); // 'A', 'B', 'C', 'D'
                const isSelected = currentSelection === optKey;

                return (
                  <button
                    key={optKey}
                    onClick={() => selectOption(currentQuestion.id, optKey)}
                    className={`w-full flex items-start text-left p-4 rounded-2xl border-2 transition-all duration-200
                      ${isSelected
                        ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-400 dark:bg-indigo-950/10 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/50 font-medium'
                      }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0
                      ${isSelected
                        ? 'bg-indigo-600 text-white dark:bg-indigo-400 dark:text-slate-950'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {optKey}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-400 leading-tight">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons (Desktop only, hidden on mobile) */}
          <div className="hidden md:flex flex-wrap items-center justify-between gap-3 pt-8 border-t border-slate-200 dark:border-slate-800 mt-12">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleMarkForReview(currentQuestion.id)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-colors
                  ${markedForReview.includes(currentQuestion.id)
                    ? 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
              >
                {markedForReview.includes(currentQuestion.id) ? 'Marked for Review' : 'Mark for Review'}
              </button>
              {currentSelection && (
                <button
                  onClick={() => clearResponse(currentQuestion.id)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                >
                  Clear Response
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questionsList.length - 1}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 disabled:hover:bg-indigo-600"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Right Side: Question Palette (Desktop view) */}
        <aside className="hidden md:block w-[340px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 overflow-y-auto">
          {/* Summary counts */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-center">
              <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Answered</p>
              <h4 className="text-base font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">{answeredCount}</h4>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/30 text-center">
              <p className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">Marked</p>
              <h4 className="text-base font-extrabold text-purple-700 dark:text-purple-300 mt-0.5">{markedCount}</h4>
            </div>
          </div>

          <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-4">Question Palette</h3>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-[460px] overflow-y-auto pr-1">
            {questionsList.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => handleGoToQuestion(idx)}
                className={getPaletteBtnClass(q.id, idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Guidelines info */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3.5 h-3.5 rounded bg-emerald-600" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3.5 h-3.5 rounded bg-violet-100 border border-violet-300 dark:bg-violet-950/40 dark:border-violet-850" />
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3.5 h-3.5 rounded bg-purple-600" />
              <span>Answered & Marked</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50" />
              <span>Visited but Unanswered</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <div className="w-3.5 h-3.5 rounded bg-slate-100 dark:bg-slate-800" />
              <span>Not Visited</span>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full mt-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-colors"
          >
            Submit Entire Test
          </button>
        </aside>
      </div>

      {/* Mobile Palette Overlay */}
      {showPaletteMobile && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-[280px] bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right duration-250">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Question Palette</h3>
                <button onClick={() => setShowPaletteMobile(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                {questionsList.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      handleGoToQuestion(idx);
                      setShowPaletteMobile(false);
                    }}
                    className={getPaletteBtnClass(q.id, idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowPaletteMobile(false);
                setShowSubmitModal(true);
              }}
              className="w-full py-3 mt-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Submit Entire Test
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between gap-2 shadow-lg">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 text-xs font-bold disabled:opacity-40"
        >
          Previous
        </button>
        
        <button
          onClick={() => toggleMarkForReview(currentQuestion.id)}
          className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex-1 max-w-[120px] text-center truncate transition-colors
            ${markedForReview.includes(currentQuestion.id)
              ? 'bg-purple-600 text-white border-purple-600'
              : 'border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350'
            }`}
        >
          {markedForReview.includes(currentQuestion.id) ? 'Marked' : 'Mark'}
        </button>

        {currentSelection && (
          <button
            onClick={() => clearResponse(currentQuestion.id)}
            className="px-2.5 py-2.5 rounded-xl text-xs font-bold text-rose-500"
          >
            Clear
          </button>
        )}

        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === questionsList.length - 1}
          className="px-3.5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold">Confirm Submission</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you sure you want to submit? Once submitted, you cannot change your answers.
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Total Questions</span>
                <span className="font-bold text-slate-950 dark:text-white">150</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Answered</span>
                <span className="font-bold text-emerald-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Marked for Review</span>
                <span className="font-bold text-purple-600">{markedCount}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Unanswered</span>
                <span className="font-bold text-rose-500">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Resume Test
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  processSubmission();
                }}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-rose-500">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
              <h3 className="text-lg font-extrabold">Discard Attempt?</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Exiting will cancel your current test progress and discard any submitted responses. Do you wish to proceed?
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Resume
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  resetExam();
                  navigate('/dashboard');
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
              >
                Exit & Discard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

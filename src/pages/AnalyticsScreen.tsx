import { useNavigate } from 'react-router-dom';
import { useProgressStore } from '../store/progressStore';
import type { Question } from '../types';
import questionsData from '../data/questions.json';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, AlertCircle, ThumbsUp, Zap } from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { attempts } = useProgressStore();
  const totalTimeInSeconds = attempts.reduce((sum, a) => sum + a.totalTimeTaken, 0);

  if (attempts.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Analytics Available Yet</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Complete at least one full-length mock exam to generate detailed performance analytics and chapter-wise recommendations.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/10 transition-colors"
        >
          Go to Mock Tests
        </button>
      </div>
    );
  }

  // 1. Line Chart Data: Score progress
  const progressData = attempts.slice().reverse().map((att, idx) => ({
    name: `Attempt ${idx + 1}`,
    score: parseFloat(att.score.toFixed(2)),
    percentage: att.percentage,
    date: new Date(att.submittedAt).toLocaleDateString()
  }));

  // Calculate subject-wise metrics
  const subjectStats: Record<string, { correct: number; total: number; wrong: number; time: number }> = {
    Biology: { correct: 0, total: 0, wrong: 0, time: 0 },
    Chemistry: { correct: 0, total: 0, wrong: 0, time: 0 },
    Physics: { correct: 0, total: 0, wrong: 0, time: 0 }
  };

  const chapterStats: Record<string, { correct: number; total: number; subject: string }> = {};

  attempts.forEach((att) => {
    const questionsList = (questionsData as Question[]).filter(q => q.mock === att.mockTestId);
    
    questionsList.forEach((q) => {
      const userAns = att.answers[q.id];
      const isCorrect = userAns === q.correctAnswer;
      const isWrong = userAns && userAns !== q.correctAnswer;
      const timeSpent = att.timeSpent[q.id] || 0;

      // Subject stats
      subjectStats[q.subject].total += 1;
      subjectStats[q.subject].time += timeSpent;
      if (isCorrect) {
        subjectStats[q.subject].correct += 1;
      } else if (isWrong) {
        subjectStats[q.subject].wrong += 1;
      }

      // Chapter stats
      if (!chapterStats[q.chapter]) {
        chapterStats[q.chapter] = { correct: 0, total: 0, subject: q.subject };
      }
      chapterStats[q.chapter].total += 1;
      if (isCorrect) {
        chapterStats[q.chapter].correct += 1;
      }
    });
  });

  // 2. Bar Chart Data: Subject Accuracy
  const subjectAccuracyData = Object.keys(subjectStats).map((subj) => {
    const stats = subjectStats[subj];
    const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return {
      subject: subj,
      accuracy: acc,
      correct: stats.correct,
      wrong: stats.wrong,
      skipped: stats.total - stats.correct - stats.wrong
    };
  });

  // 3. Pie Chart Data: Time Distribution
  const colors = ['#4f46e5', '#a855f7', '#10b981'];
  const timeData = Object.keys(subjectStats).map((subj) => ({
    name: subj,
    value: Math.round(subjectStats[subj].time / 60) // convert to minutes
  }));

  // Chapter classification
  const strongChapters: { chapter: string; subject: string; accuracy: number }[] = [];
  const weakChapters: { chapter: string; subject: string; accuracy: number }[] = [];

  Object.keys(chapterStats).forEach((chap) => {
    const data = chapterStats[chap];
    const accuracy = Math.round((data.correct / data.total) * 100);
    
    if (accuracy >= 70) {
      strongChapters.push({ chapter: chap, subject: data.subject, accuracy });
    } else if (accuracy < 55) {
      weakChapters.push({ chapter: chap, subject: data.subject, accuracy });
    }
  });

  // Sort them
  strongChapters.sort((a, b) => b.accuracy - a.accuracy);
  weakChapters.sort((a, b) => a.accuracy - b.accuracy);

  // Recommendations based on weak chapters
  const revisionRecommendations = weakChapters.slice(0, 3).map((w) => {
    let focusArea = "Core principles & formulas";
    if (w.subject === 'Biology') {
      focusArea = "NCERT diagrams, pathway cycles, and cellular functions";
    } else if (w.subject === 'Physics') {
      focusArea = "Derivatives, formula sheets, and numerical question patterns";
    } else if (w.subject === 'Chemistry') {
      focusArea = "Functional groups, organic reaction mechanisms, and bonding parameters";
    }
    return {
      chapter: w.chapter,
      subject: w.subject,
      focus: focusArea
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
          Performance Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          In-depth reports mapping your strengths, weak topics, and mock exam timelines.
        </p>
      </div>

      {/* Row 1: Key Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-2">Primary Weak Chapter</h3>
          {weakChapters.length > 0 ? (
            <div>
              <h4 className="text-xl font-extrabold text-rose-600 dark:text-rose-400 truncate">{weakChapters[0].chapter}</h4>
              <p className="text-xs text-slate-400 mt-1">{weakChapters[0].subject} • Accuracy: {weakChapters[0].accuracy}%</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No critical weak chapters identified yet!</p>
          )}
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-2">Primary Strong Chapter</h3>
          {strongChapters.length > 0 ? (
            <div>
              <h4 className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 truncate">{strongChapters[0].chapter}</h4>
              <p className="text-xs text-slate-400 mt-1">{strongChapters[0].subject} • Accuracy: {strongChapters[0].accuracy}%</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Attempt more questions to show strong chapters.</p>
          )}
        </div>

        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-slate-400 mb-2">Time per Question</h3>
          <div>
            <h4 className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {(totalTimeInSeconds / (attempts.length * 150)).toFixed(1)} seconds
            </h4>
            <p className="text-xs text-slate-400 mt-1">Recommended pacing is &lt; 72 seconds.</p>
          </div>
        </div>
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Chart 1: Score Progress */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Score Progress Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 150]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subject-wise Accuracy */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Subject Accuracy Analysis</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAccuracyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Time Spent per Subject */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Time Allocation per Subject</h3>
            <p className="text-xs text-slate-400 mb-6">Measured in minutes spent across all test sections.</p>
            
            <div className="space-y-3.5">
              {timeData.map((d, idx) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-400">{d.name}</span>
                  <span className="text-xs font-bold text-slate-950 dark:text-white ml-auto">{d.value} mins</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-56 h-56 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {timeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommendations Area */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-6">Actionable Revision Plan</h3>
          
          <div className="space-y-4">
            {revisionRecommendations.length > 0 ? (
              revisionRecommendations.map((rec) => (
                <div key={rec.chapter} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{rec.chapter}</h4>
                      <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                        {rec.subject}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Focus: <span className="text-slate-700 dark:text-slate-300 font-semibold">{rec.focus}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-8">
                Keep attempting tests. Once a weak area is identified, revision recommendations will display here.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Chapter Breakdown Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strong Chapters */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ThumbsUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Topic Strengths (&gt;=70% accuracy)</h3>
          </div>
          
          <div className="space-y-3.5">
            {strongChapters.length > 0 ? (
              strongChapters.slice(0, 5).map((s) => (
                <div key={s.chapter} className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.chapter}</p>
                    <p className="text-[10px] text-slate-400">{s.subject}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {s.accuracy}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No strong chapters found yet. Practice makes perfect!</p>
            )}
          </div>
        </div>

        {/* Weak Chapters */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Improvement Needed (&lt;55% accuracy)</h3>
          </div>
          
          <div className="space-y-3.5">
            {weakChapters.length > 0 ? (
              weakChapters.slice(0, 5).map((w) => (
                <div key={w.chapter} className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{w.chapter}</p>
                    <p className="text-[10px] text-slate-400">{w.subject}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    {w.accuracy}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">Great work! You have no critical weak chapters.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

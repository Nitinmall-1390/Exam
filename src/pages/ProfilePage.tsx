import React, { useState } from 'react';
import { useProgressStore } from '../store/progressStore';
import { ArrowLeft, User, MapPin, Save, AlertTriangle, ShieldCheck, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, setProfile, attempts, resetProgress } = useProgressStore();

  const [inputName, setInputName] = useState(profile?.name ?? '');
  const [inputState, setInputState] = useState(profile?.state ?? '');
  const [showResetModal, setShowResetModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ name: inputName, state: inputState, targetYear: profile?.targetYear ?? '2025', createdAt: profile?.createdAt ?? new Date().toISOString() });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetModal(false);
    alert('All progress, attempts, and bookmarks have been successfully cleared.');
  };

  // Profile Stats
  const totalAttempts = attempts.length;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.score)).toFixed(2) : '0.00';
  const latestScore = totalAttempts > 0 ? attempts[0].score.toFixed(2) : '0.00';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
        Student Profile & Settings
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
        Manage your profile information, view score landmarks, or reset study session histories.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Profile Card & Info */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Personal Information</h3>

            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/25 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Profile updated successfully.
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aspirant Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State / City</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={inputState}
                  onChange={(e) => setInputState(e.target.value)}
                  placeholder="e.g. Ranchi, Jharkhand"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/10 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </form>

          {/* Danger Zone */}
          <div className="p-6 rounded-3xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-500/[0.02] space-y-4">
            <h3 className="font-extrabold text-sm text-rose-600 dark:text-rose-400">Danger Zone</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Resetting progress permanently deletes all of your historical exam scores, selected answer patterns, and bookmarked questions. This action is irreversible.
            </p>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white text-xs font-bold border border-rose-500/25 flex items-center gap-2 transition-all"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Reset All Progress
            </button>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Exam Overview</h3>

          <div className="space-y-4 text-xs font-medium text-slate-655">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Total Attempts</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalAttempts} tests</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-400">Highest Score</span>
              <span className="font-bold text-indigo-650 dark:text-indigo-400">{bestScore} / 150</span>
            </div>
            <div className="flex justify-between py-1.5 last:border-0">
              <span className="text-slate-400">Latest Score</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{latestScore} / 150</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 text-rose-500">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
              <h3 className="text-lg font-extrabold">Verify Deletion</h3>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you absolutely sure you want to delete all exam records and saved questions? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

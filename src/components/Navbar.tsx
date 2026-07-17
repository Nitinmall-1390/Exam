import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useProgressStore } from '../store/progressStore';
import { Sun, Moon, BookOpen, BarChart3, Bookmark, User, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProgressStore();
  const displayName = profile?.name ?? 'Aspirant';
  const location = useLocation();

  // Don't show navbar on active exam screen
  if (location.pathname.startsWith('/exam/')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) => `
    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
    ${isActive(path)
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }
  `;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                JCECEB Nursing
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Mock Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              <BookOpen className="w-4 h-4" />
              <span>Tests</span>
            </Link>
            <Link to="/analytics" className={linkClass('/analytics')}>
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
            <Link to="/bookmarks" className={linkClass('/bookmarks')}>
              <Bookmark className="w-4 h-4" />
              <span>Bookmarks</span>
            </Link>
            <Link to="/profile" className={linkClass('/profile')}>
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Profile Summary */}
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="w-7.5 h-7.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                {displayName ? displayName[0].toUpperCase() : 'A'}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                {displayName}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar - Sticky Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 py-2 flex items-center justify-around">
        <Link to="/dashboard" className={`flex flex-col items-center p-2 text-xs font-medium ${isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Tests</span>
        </Link>
        <Link to="/analytics" className={`flex flex-col items-center p-2 text-xs font-medium ${isActive('/analytics') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span>Analytics</span>
        </Link>
        <Link to="/bookmarks" className={`flex flex-col items-center p-2 text-xs font-medium ${isActive('/bookmarks') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span>Bookmarks</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center p-2 text-xs font-medium ${isActive('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

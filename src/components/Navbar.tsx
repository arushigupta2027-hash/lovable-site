import React from 'react';
import { Sparkles, Layers, Image as ImageIcon, LayoutGrid, Plus, Moon, Sun, User, Wand2 } from 'lucide-react';

export interface NavbarProps {
  currentView: string;
  setCurrentView?: (view: any) => void;
  onNavigate?: (view: any) => void;
  isDarkMode?: boolean;
  darkMode?: boolean;
  setIsDarkMode?: (dark: boolean) => void;
  onToggleDarkMode?: () => void;
  onOpenAuth?: () => void;
  user?: any;
  hasActiveProject?: boolean;
  onStartNewDump?: () => void;
  onCreateClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNavigate,
  isDarkMode,
  darkMode,
  setIsDarkMode,
  onToggleDarkMode,
  onOpenAuth,
  user,
  hasActiveProject = false,
  onStartNewDump,
  onCreateClick,
}) => {
  const activeDark = Boolean(isDarkMode ?? darkMode);

  const handleNavigate = (view: string) => {
    if (setCurrentView) setCurrentView(view);
    else if (onNavigate) onNavigate(view);
  };

  const handleToggleDark = () => {
    if (setIsDarkMode) setIsDarkMode(!activeDark);
    else if (onToggleDarkMode) onToggleDarkMode();
  };

  const handleCreate = () => {
    if (onStartNewDump) onStartNewDump();
    else if (onCreateClick) onCreateClick();
  };

  const handleAuth = () => {
    if (onOpenAuth) onOpenAuth();
    else handleNavigate('dashboard');
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b ${
        activeDark
          ? 'bg-[#121214]/90 border-stone-800 text-stone-100'
          : 'bg-[#FAF8F5]/90 border-stone-200/80 text-stone-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => handleNavigate('landing')}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-400 via-amber-300 to-violet-400 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <div
                className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                  activeDark ? 'bg-stone-900' : 'bg-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-rose-500 fill-rose-100 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight">BrainDump</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-stone-400 -mt-0.5 font-medium hidden sm:block">
                photo-dump carousels
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              id="nav-templates-btn"
              onClick={() => handleNavigate('templates')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'templates'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Inspiration
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => handleNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              My Dumps
            </button>

            {hasActiveProject && (
              <button
                id="nav-editor-btn"
                onClick={() => handleNavigate('editor')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentView === 'editor'
                    ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-white font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/50'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Active Editor
              </button>
            )}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={handleToggleDark}
            title={activeDark ? 'Switch to Warm Cream' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
          >
            {activeDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth */}
          <button
            id="user-auth-btn"
            onClick={handleAuth}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-sm font-medium transition-colors"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="hidden sm:inline text-xs font-semibold">{user?.name || 'Creator'}</span>
          </button>

          {/* Create New Dump CTA */}
          <button
            id="create-dump-nav-btn"
            onClick={handleCreate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white dark:bg-white dark:text-stone-900 text-xs sm:text-sm font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-amber-300 dark:text-rose-500" />
            <span>Create Dump</span>
          </button>
        </div>
      </div>
    </header>
  );
};

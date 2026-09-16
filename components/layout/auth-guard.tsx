'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/use-auth-store';
import { useSettingsStore } from '../../store/use-settings-store';
import LoginPage from '../../app/login/page';
import SignupPage from '../../app/signup/page';
import { JiraTopbar } from './jira-topbar';
import { JiraSidebar } from './jira-sidebar';
import { NavigationLoader } from './navigation-loader';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuthStore();
  const { theme, toggleTheme } = useSettingsStore();

  const isSignup = pathname === '/signup';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Minimal Standalone Auth Shell for unauthenticated visitors
  const renderAuthShell = (content: React.ReactNode) => (
    <div className="flex flex-col min-h-screen bg-[#f6f5f4] dark:bg-[#0a1530] text-[#1a1a1a] dark:text-[#f6f5f4] transition-colors">
      {/* Minimal Clean Auth Topbar - NO application menus or sidebar */}
      <header className="h-14 bg-white dark:bg-[#0f1c3d] border-b border-[#e5e3df] dark:border-[#243769] flex items-center justify-between px-4 sm:px-6 select-none shrink-0">
        <Link href="/" className="flex items-center space-x-2 font-bold hover:opacity-95">
          <div className="w-8 h-8 rounded-lg bg-[#5645d4] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-[#5645d4]">
            EduGen<span className="text-[#1a1a1a] dark:text-[#f6f5f4] font-normal"> AI</span>
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-md text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] hover:text-[#1a1a1a] dark:hover:text-white transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#f5d75e]" /> : <Moon className="w-4 h-4" />}
          </button>

          {isSignup ? (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-[#5645d4] hover:underline"
            >
              Sign In →
            </Link>
          ) : (
            <Link
              href="/signup"
              className="bg-[#5645d4] hover:bg-[#4534b3] text-white text-xs sm:text-sm font-medium px-3.5 py-1.5 rounded-md transition-colors shadow-2xs"
            >
              Register Account
            </Link>
          )}
        </div>
      </header>

      {/* Centered Auth Content Screen */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {content}
        </div>
      </main>
    </div>
  );

  // While checking initial client storage state, render seamless clean loading shell
  if (!isReady) {
    return renderAuthShell(
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-2xl shadow-sm space-y-3">
        <div className="w-6 h-6 rounded-full border-2 border-[#5645d4] border-t-transparent animate-spin" />
        <span className="text-sm font-semibold text-[#5d5b54] dark:text-[#a4a097]">Initializing EduGen AI Workspace...</span>
      </div>
    );
  }

  // If user is explicitly on /signup page and not authenticated
  if (isSignup && !isAuthenticated) {
    return renderAuthShell(<SignupPage />);
  }

  // If unauthenticated by default, show clean Login screen (NO menus, NO sidebar)
  if (!isAuthenticated) {
    return renderAuthShell(<LoginPage />);
  }

  // Authenticated user gets full Workspace UI (Topbar + Sidebar + Main Canvas with 0px gap)
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f6f5f4] dark:bg-[#0a1530]">
      <NavigationLoader />
      {/* Top Navigation Bar - Flush 0px Gap */}
      <JiraTopbar onOpenMobileNav={() => setMobileNavOpen(true)} />

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar Navigation - Sticky and Flush */}
        <JiraSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

        {/* Main Application Content Stage */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 bg-[#f6f5f4] dark:bg-[#0a1530] min-w-0">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

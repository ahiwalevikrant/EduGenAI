'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Grid, 
  Sparkles, 
  Plus, 
  Search, 
  Settings, 
  Sun, 
  Moon, 
  Calendar,
  Cpu, 
  FileText, 
  Presentation, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  User,
  LogOut,
  LogIn,
  BookOpen,
  FolderOpen,
  X,
  Menu,
  ChevronDown,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useCurriculumStore } from '../../store/use-curriculum-store';
import { useSettingsStore } from '../../store/use-settings-store';
import { useAuthStore } from '../../store/use-auth-store';

export function JiraTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { boardId, classGrade, subjectId, selectedChapter, setSelectedChapter } = useCurriculumStore();
  const { activeProvider, theme, toggleTheme } = useSettingsStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const appSwitcherRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (appSwitcherRef.current && !appSwitcherRef.current.contains(e.target as Node)) {
        setAppSwitcherOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target as Node)) {
        setCreateMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setAppSwitcherOpen(false);
        setCreateMenuOpen(false);
        setProfileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = [
    { title: 'Motion & Velocity (Kinematics)', code: 'CH07', subject: 'Science', href: '/generate/question-paper', type: 'Chapter' },
    { title: 'Force and Laws of Motion', code: 'CH08', subject: 'Science', href: '/generate/dpp', type: 'Chapter' },
    { title: 'Gravitation & Free Fall', code: 'CH09', subject: 'Science', href: '/generate/ppt', type: 'Chapter' },
    { title: 'Ohm\'s Law & Electric Circuits', code: 'CH11', subject: 'Physics', href: '/generate/images', type: 'Diagram' },
    { title: 'Chemical Reactions and Equations', code: 'CH01', subject: 'Chemistry', href: '/curriculum', type: 'Curriculum' },
    { title: 'Quadratic Equations & Roots', code: 'CH04', subject: 'Mathematics', href: '/generate/question-paper', type: 'Blueprint' }
  ].filter(item => 
    !searchQuery.trim() || 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="h-14 bg-white dark:bg-[#0f1c3d] border-b border-[#e5e3df] dark:border-[#243769] flex items-center justify-between px-3 md:px-5 text-[#1a1a1a] dark:text-[#f6f5f4] select-none sticky top-0 z-40 shrink-0 transition-colors">
        {/* Left: App Switcher, Logo & Global Nav */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          {/* App Switcher Dropdown */}
          <div className="relative" ref={appSwitcherRef}>
            <button 
              onClick={() => setAppSwitcherOpen(!appSwitcherOpen)}
              title="EduGen AI Workspace Suite" 
              className={`p-2 rounded-md transition-colors cursor-pointer ${appSwitcherOpen ? 'bg-[#e6e0f5] text-[#5645d4]' : 'text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] hover:text-[#1a1a1a] dark:hover:text-white'}`}
            >
              <Grid className="w-5 h-5" />
            </button>

            {appSwitcherOpen && (
              <div className="absolute top-11 left-0 w-72 bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-lg shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-bold text-[#787671] dark:text-[#a4a097] uppercase px-2.5 py-1 tracking-wider">
                  Teaching Suite Apps
                </div>
                <div className="grid grid-cols-1 gap-1 mt-1">
                  <Link
                    href="/curriculum"
                    onClick={() => setAppSwitcherOpen(false)}
                    className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <BookOpen className="w-4 h-4 text-[#5645d4]" />
                    <div>
                      <div className="font-semibold text-xs">Curriculum Directory</div>
                      <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">NCERT, Balbharati, CISCE</div>
                    </div>
                  </Link>

                  <Link
                    href="/generate/question-paper"
                    onClick={() => setAppSwitcherOpen(false)}
                    className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <FileText className="w-4 h-4 text-[#0075de]" />
                    <div>
                      <div className="font-semibold text-xs">Question Paper Generator</div>
                      <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">Board-aligned assessments</div>
                    </div>
                  </Link>

                  <Link
                    href="/generate/dpp"
                    onClick={() => setAppSwitcherOpen(false)}
                    className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <Calendar className="w-4 h-4 text-[#dd5b00]" />
                    <div>
                      <div className="font-semibold text-xs">Daily Practice Plan (DPP)</div>
                      <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">Multi-day practice sheets</div>
                    </div>
                  </Link>

                  <Link
                    href="/generate/ppt"
                    onClick={() => setAppSwitcherOpen(false)}
                    className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <Presentation className="w-4 h-4 text-[#2a9d99]" />
                    <div>
                      <div className="font-semibold text-xs">Teaching PPT Studio</div>
                      <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">3-Panel slide masterclass</div>
                    </div>
                  </Link>

                  <Link
                    href="/generate/images"
                    onClick={() => setAppSwitcherOpen(false)}
                    className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <ImageIcon className="w-4 h-4 text-[#7b3ff2]" />
                    <div>
                      <div className="font-semibold text-xs">Diagram Studio</div>
                      <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">Scientific vector illustrations</div>
                    </div>
                  </Link>

                  <Link
                    href="/history"
                    onClick={() => setAppSwitcherOpen(false)}
                    className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <FolderOpen className="w-4 h-4 text-[#1aae39]" />
                    <div>
                      <div className="font-semibold text-xs">Saved Repositories</div>
                      <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">Saved papers and decks</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 font-bold text-[#1a1a1a] dark:text-[#f6f5f4] hover:opacity-95">
            <div className="w-7 h-7 rounded-md bg-[#5645d4] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#5645d4]">
              EduGen<span className="text-[#1a1a1a] dark:text-[#f6f5f4] font-normal"> AI</span>
            </span>
          </Link>

          <div className="h-5 w-[1px] bg-[#e5e3df] dark:bg-[#243769] mx-1 hidden lg:block" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
            <Link 
              href="/curriculum" 
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname === '/curriculum' ? 'bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] font-semibold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] hover:text-[#1a1a1a] dark:hover:text-white'}`}
            >
              Curriculum
            </Link>
            <Link 
              href="/generate/question-paper" 
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname.startsWith('/generate/question-paper') ? 'bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] font-semibold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] hover:text-[#1a1a1a] dark:hover:text-white'}`}
            >
              Question Papers
            </Link>
            <Link 
              href="/generate/dpp" 
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname.startsWith('/generate/dpp') ? 'bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] font-semibold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] hover:text-[#1a1a1a] dark:hover:text-white'}`}
            >
              DPP Plans
            </Link>
            <Link 
              href="/generate/ppt" 
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname.startsWith('/generate/ppt') ? 'bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] font-semibold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] hover:text-[#1a1a1a] dark:hover:text-white'}`}
            >
              Teaching PPT
            </Link>
            <Link 
              href="/history" 
              className={`px-3 py-1.5 rounded-md transition-colors ${pathname === '/history' ? 'bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] font-semibold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] hover:text-[#1a1a1a] dark:hover:text-white'}`}
            >
              Repository
            </Link>
          </nav>
        </div>

        {/* Center: Interactive Search Trigger */}
        <div className="flex-1 max-w-xs md:max-w-sm mx-2 md:mx-4 hidden md:flex items-center">
          <button
            type="button"
            onClick={() => setSearchModalOpen(true)}
            className="w-full flex items-center justify-between bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] rounded-md py-1.5 px-3 text-xs text-[#787671] dark:text-[#a4a097] transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center space-x-2 truncate">
              <Search className="w-3.5 h-3.5 text-[#787671]" />
              <span className="truncate">Search NCERT topics, formulas, or chapters...</span>
            </div>
            <kbd className="hidden sm:inline-block bg-white dark:bg-black/40 border border-[#c8c4be] dark:border-[#243769] rounded px-1.5 py-0.5 text-[10px] font-mono text-[#5d5b54] dark:text-[#a4a097]">
              /
            </kbd>
          </button>
        </div>

        {/* Right Actions: Theme, Create (+), AI Status, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Active Chapter Pill (Desktop) */}
          {selectedChapter && (
            <div className="hidden xl:flex items-center space-x-2 bg-[#f6f5f4] dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]">
              <span className="w-2 h-2 rounded-full bg-[#1aae39] shrink-0" />
              <span className="text-[#5d5b54] dark:text-[#a4a097] uppercase font-bold text-[10px]">{boardId.toUpperCase()} C{classGrade}</span>
              <span className="truncate max-w-[110px] font-medium">{selectedChapter.title}</span>
            </div>
          )}

          {/* AI Provider Status Badge */}
          <Link 
            href="/settings"
            title={`Active AI Provider: ${activeProvider?.name || 'OpenRouter / Groq'}`}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] rounded-md text-xs font-semibold transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-[#5645d4]" />
            <span className="hidden sm:inline text-[#1a1a1a] dark:text-[#f6f5f4] text-xs">{activeProvider?.name?.split(' ')[0] || 'Groq'}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1aae39]" />
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-1.5 sm:p-2 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] rounded-md text-[#1a1a1a] dark:text-[#f6f5f4] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#37352f]" />
            )}
          </button>

          {/* Create Button with Quick Dropdown */}
          <div className="relative" ref={createMenuRef}>
            <button
              onClick={() => setCreateMenuOpen(!createMenuOpen)}
              className="flex items-center space-x-1.5 bg-[#5645d4] hover:bg-[#4534b3] text-white text-xs sm:text-sm font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Create</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {createMenuOpen && (
              <div className="absolute top-10 right-0 w-60 bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-lg shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-bold text-[#787671] dark:text-[#a4a097] uppercase px-2 py-1 tracking-wider">
                  Create Content
                </div>
                <Link
                  href="/generate/question-paper"
                  onClick={() => setCreateMenuOpen(false)}
                  className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]"
                >
                  <FileText className="w-4 h-4 text-[#5645d4]" />
                  <span>Question Paper</span>
                </Link>
                <Link
                  href="/generate/dpp"
                  onClick={() => setCreateMenuOpen(false)}
                  className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]"
                >
                  <Calendar className="w-4 h-4 text-[#dd5b00]" />
                  <span>Daily Practice Plan (DPP)</span>
                </Link>
                <Link
                  href="/generate/ppt"
                  onClick={() => setCreateMenuOpen(false)}
                  className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]"
                >
                  <Presentation className="w-4 h-4 text-[#2a9d99]" />
                  <span>Teaching Slide Deck</span>
                </Link>
                <Link
                  href="/generate/images"
                  onClick={() => setCreateMenuOpen(false)}
                  className="flex items-center space-x-2.5 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]"
                >
                  <ImageIcon className="w-4 h-4 text-[#7b3ff2]" />
                  <span>Educational Diagram</span>
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-8 h-8 rounded-md bg-[#5645d4] hover:bg-[#4534b3] text-white flex items-center justify-center font-bold text-xs shadow-xs transition-colors cursor-pointer"
              title={user ? user.name : 'Account Profile'}
            >
              {user?.initials || 'AD'}
            </button>

            {profileMenuOpen && (
              <div className="absolute top-11 right-0 w-68 bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2.5">
                <div className="border-b border-[#e5e3df] dark:border-[#243769] pb-2.5">
                  <div className="text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">
                    {user?.name || 'Admin Educator'}
                  </div>
                  <div className="text-xs text-[#5d5b54] dark:text-[#a4a097] truncate">
                    {user?.email || 'admin@edugen.ai'}
                  </div>
                  <div className="text-[10px] mt-1 inline-block font-mono font-bold bg-[#d9f3e1] text-[#006644] px-2 py-0.5 rounded">
                    {user?.role || 'Admin / Master Teacher'}
                  </div>
                </div>

                <div className="space-y-1 text-xs font-medium">
                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <Settings className="w-4 h-4 text-[#5d5b54] dark:text-[#a4a097]" />
                    <span>AI Provider Settings</span>
                  </Link>

                  <Link
                    href="/history"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4]"
                  >
                    <FolderOpen className="w-4 h-4 text-[#5d5b54] dark:text-[#a4a097]" />
                    <span>My Saved Repositories</span>
                  </Link>
                </div>

                <div className="pt-2 border-t border-[#e5e3df] dark:border-[#243769]">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                        router.push('/login');
                      }}
                      className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-[#fde0ec] text-[#e03131] text-xs font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setProfileMenuOpen(false)}
                      className="w-full flex items-center space-x-2 p-2 rounded-md bg-[#5645d4] text-white text-xs font-semibold justify-center shadow-xs"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Log In / Switch Account</span>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-[#5d5b54] dark:text-[#a4a097] hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] lg:hidden"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0f1c3d] border-b border-[#e5e3df] dark:border-[#243769] px-4 py-3 space-y-2 z-40 animate-in slide-in-from-top-2 duration-150">
          <Link
            href="/curriculum"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 rounded-md text-sm font-semibold hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"
          >
            Curriculum Directory
          </Link>
          <Link
            href="/generate/question-paper"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 rounded-md text-sm font-semibold hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"
          >
            Question Paper Generator
          </Link>
          <Link
            href="/generate/dpp"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 rounded-md text-sm font-semibold hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"
          >
            Daily Practice Plan (DPP)
          </Link>
          <Link
            href="/generate/ppt"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 rounded-md text-sm font-semibold hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"
          >
            Teaching PPT Studio
          </Link>
          <Link
            href="/history"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 rounded-md text-sm font-semibold hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"
          >
            Saved Artifacts Repository
          </Link>
          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-2 rounded-md text-sm font-semibold hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"
          >
            AI Settings (OpenRouter / Groq)
          </Link>
        </div>
      )}

      {/* Interactive Command Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-lg shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Search Input Bar */}
            <div className="p-3.5 border-b border-[#e5e3df] dark:border-[#243769] flex items-center space-x-3">
              <Search className="w-5 h-5 text-[#5645d4]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                placeholder="Type chapter title, NCERT topic, formula (e.g. Motion, Ohm's law)..."
                className="flex-1 bg-transparent text-sm md:text-base font-medium text-[#1a1a1a] dark:text-[#f6f5f4] outline-none placeholder:text-[#a4a097]"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 text-[#787671] hover:text-[#1a1a1a] dark:hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filtered Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="text-[10px] font-bold text-[#787671] dark:text-[#a4a097] uppercase px-3 py-1 tracking-wider">
                Curriculum Chapters & Blueprints
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setSearchModalOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-md hover:bg-[#f6f5f4] dark:hover:bg-[#16254c] text-sm group transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-bold bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                      <div>
                        <div className="font-semibold text-xs md:text-sm text-[#1a1a1a] dark:text-[#f6f5f4] group-hover:text-[#5645d4]">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097]">
                          {item.subject} • Official Syllabus Grounded
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-[#787671] dark:text-[#a4a097] bg-[#f6f5f4] dark:bg-[#16254c] px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[#787671] dark:text-[#a4a097]">
                  No chapters found matching "{searchQuery}". Try "Motion", "Ohm", or "Science".
                </div>
              )}
            </div>

            <div className="p-2.5 bg-[#f6f5f4] dark:bg-[#0a1530] border-t border-[#e5e3df] dark:border-[#243769] text-[11px] text-[#787671] dark:text-[#a4a097] flex justify-between items-center px-4">
              <span>Press <kbd className="font-mono bg-white dark:bg-black/40 px-1 py-0.5 rounded border border-[#c8c4be] dark:border-[#243769]">ESC</kbd> to exit</span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1aae39]" />
                <span>Verified Official Textbooks</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

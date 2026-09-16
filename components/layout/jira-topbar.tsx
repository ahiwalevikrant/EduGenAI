'use client';

import Link from 'next/link';
import { Menu, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useSettingsStore } from '../../store/use-settings-store';

interface JiraTopbarProps { onOpenMobileNav: () => void; }

export function JiraTopbar({ onOpenMobileNav }: JiraTopbarProps) {
  const { theme, toggleTheme } = useSettingsStore();
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-[#e5e3df] bg-white px-3 text-[#1a1a1a] dark:border-[#243769] dark:bg-[#0f1c3d] dark:text-[#f6f5f4] sm:px-5">
      <button onClick={onOpenMobileNav} className="rounded-md p-2 text-[#5d5b54] hover:bg-[#f6f5f4] dark:text-[#a4a097] dark:hover:bg-[#16254c] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
      <Link href="/" className="flex shrink-0 items-center gap-2 font-bold hover:opacity-90"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#5645d4] text-white shadow-sm"><Sparkles className="h-4 w-4" /></span><span className="text-base tracking-tight text-[#5645d4] sm:text-lg">EduGen <span className="font-normal text-[#1a1a1a] dark:text-[#f6f5f4]">AI</span></span></Link>
      <Link href="/curriculum" className="ml-auto flex min-w-0 max-w-md flex-1 items-center gap-2 rounded-md border border-[#e5e3df] bg-[#f6f5f4] px-3 py-1.5 text-left text-xs text-[#787671] hover:bg-[#ede9e4] dark:border-[#243769] dark:bg-[#16254c] dark:hover:bg-[#1d2e5a] sm:ml-4" aria-label="Search curriculum"><Search className="h-3.5 w-3.5 shrink-0" /><span className="truncate">Search curriculum, chapters, or topics</span></Link>
      <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="rounded-md border border-[#e5e3df] bg-[#f6f5f4] p-2 text-[#37352f] hover:bg-[#ede9e4] dark:border-[#243769] dark:bg-[#16254c] dark:text-[#f6f5f4] dark:hover:bg-[#1d2e5a]">{theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}</button>
    </header>
  );
}

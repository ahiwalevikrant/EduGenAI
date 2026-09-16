'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LogOut, Menu, Moon, Settings, Sparkles, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettingsStore } from '../../store/use-settings-store';
import { useAuthStore } from '../../store/use-auth-store';

interface JiraTopbarProps { onOpenMobileNav: () => void; }

export function JiraTopbar({ onOpenMobileNav }: JiraTopbarProps) {
  const { theme, toggleTheme } = useSettingsStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-[#e5e3df] bg-white px-3 text-[#1a1a1a] dark:border-[#243769] dark:bg-[#0f1c3d] dark:text-[#f6f5f4] sm:px-5">
      <button onClick={onOpenMobileNav} className="rounded-md p-2 text-[#5d5b54] hover:bg-[#f6f5f4] dark:text-[#a4a097] dark:hover:bg-[#16254c] lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
      <Link href="/" className="flex shrink-0 items-center gap-2 font-bold hover:opacity-90"><span className="grid h-7 w-7 place-items-center rounded-md bg-[#5645d4] text-white shadow-sm"><Sparkles className="h-4 w-4" /></span><span className="text-base tracking-tight text-[#5645d4] sm:text-lg">EduGen <span className="font-normal text-[#1a1a1a] dark:text-[#f6f5f4]">AI</span></span></Link>
      <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} className="ml-auto rounded-md border border-[#e5e3df] bg-[#f6f5f4] p-2 text-[#37352f] hover:bg-[#ede9e4] dark:border-[#243769] dark:bg-[#16254c] dark:text-[#f6f5f4] dark:hover:bg-[#1d2e5a]">{theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}</button>
      <div className="relative"><button onClick={() => setProfileOpen((open) => !open)} title={user?.name || 'Educator profile'} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#5645d4] text-xs font-bold text-white shadow-sm">{user?.initials || 'ED'}</button>{profileOpen && <div className="absolute right-0 top-10 w-48 rounded-lg border border-[#e5e3df] bg-white p-2 shadow-xl dark:border-[#243769] dark:bg-[#0f1c3d]"><div className="border-b border-[#e5e3df] px-2 py-1.5 text-xs font-semibold text-[#37352f] dark:border-[#243769] dark:text-[#f6f5f4]">{user?.name || 'Educator'}</div><Link href="/settings" onClick={() => setProfileOpen(false)} className="mt-1 flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-[#f6f5f4] dark:hover:bg-[#16254c]"><Settings className="h-4 w-4" />AI Settings</Link><button onClick={() => { logout(); setProfileOpen(false); router.push('/login'); }} className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-[#b42318] hover:bg-[#fde0ec] dark:text-[#ff9a9a] dark:hover:bg-red-950/40"><LogOut className="h-4 w-4" />Log out</button></div>}</div>
    </header>
    </>
  );
}

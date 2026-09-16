'use client';

import Link from 'next/link';
import { BookOpen, CheckSquare, FileText, FolderOpen, Home, Image as ImageIcon, LogOut, Presentation, Settings, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/use-auth-store';

const primaryItems = [{ label: 'Home', href: '/', icon: Home }, { label: 'Curriculum', href: '/curriculum', icon: BookOpen }];
const createItems = [
  { label: 'Question paper', href: '/generate/question-paper', icon: FileText },
  { label: 'Daily practice plan', href: '/generate/dpp', icon: BookOpen },
  { label: 'Answer key & rubric', href: '/generate/answer-key', icon: CheckSquare },
  { label: 'Teaching slides', href: '/generate/ppt', icon: Presentation },
  { label: 'Diagrams', href: '/generate/images', icon: ImageIcon },
];

interface JiraSidebarProps { mobileOpen?: boolean; onCloseMobile?: () => void; }

export function JiraSidebar({ mobileOpen = false, onCloseMobile }: JiraSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const item = (entry: typeof primaryItems[number]) => {
    const Icon = entry.icon;
    const active = entry.href === '/' ? pathname === '/' : pathname.startsWith(entry.href);
    return <Link key={entry.href} href={entry.href} onClick={onCloseMobile} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? 'bg-[#e6e0f5] font-semibold text-[#5645d4] dark:bg-[#5645d4]/20' : 'text-[#37352f] hover:bg-[#ede9e4] dark:text-[#f6f5f4] dark:hover:bg-[#1d2e5a]'}`}><Icon className="h-4 w-4 shrink-0" />{entry.label}</Link>;
  };
  return <>
    {mobileOpen && <button aria-label="Close navigation" onClick={onCloseMobile} className="fixed inset-0 z-40 bg-[#0a1530]/40 lg:hidden" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#e5e3df] bg-[#fafaf9] p-3 transition-transform dark:border-[#243769] dark:bg-[#0f1c3d] lg:static lg:w-64 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-5 flex items-center justify-between px-2 pt-1 lg:hidden"><span className="text-sm font-bold text-[#5645d4]">Navigation</span><button onClick={onCloseMobile} className="rounded-md p-2 text-[#5d5b54] dark:text-[#a4a097]" aria-label="Close navigation"><X className="h-5 w-5" /></button></div>
      <nav className="space-y-1">{primaryItems.map(item)}</nav>
      <div className="my-5 border-t border-[#e5e3df] dark:border-[#243769]" />
      <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-[#787671] dark:text-[#a4a097]">CREATE TEACHING MATERIAL</p>
      <nav className="space-y-1">{createItems.map(item)}</nav>
      <div className="mt-auto space-y-1 border-t border-[#e5e3df] pt-3 dark:border-[#243769]">{item({ label: 'Saved work', href: '/history', icon: FolderOpen })}{item({ label: 'Settings', href: '/settings', icon: Settings })}<button onClick={() => { logout(); onCloseMobile?.(); router.push('/login'); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#b42318] transition-colors hover:bg-[#fde0ec] dark:text-[#ff9a9a] dark:hover:bg-red-950/40"><LogOut className="h-4 w-4" />Log out</button></div>
    </aside>
  </>;
}

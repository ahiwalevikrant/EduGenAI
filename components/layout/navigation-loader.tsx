'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const startedAt = useRef(0);
  const destinationPath = useRef<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      startedAt.current = Date.now();
      destinationPath.current = url.pathname;
      setIsLoading(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    if (!isLoading || pathname !== destinationPath.current) return;
    const timer = window.setTimeout(() => {
      setIsLoading(false);
      destinationPath.current = null;
    }, Math.max(0, 220 - (Date.now() - startedAt.current)));
    return () => window.clearTimeout(timer);
  }, [pathname, isLoading]);

  if (!isLoading) return null;
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0a1530]/10 backdrop-blur-[1px] dark:bg-black/25" aria-live="polite" aria-label="Loading page"><div className="flex items-center gap-3 rounded-xl border border-[#e5e3df] bg-white px-4 py-3 shadow-xl dark:border-[#243769] dark:bg-[#0f1c3d]"><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#5645d4] border-t-transparent" /><span className="text-sm font-semibold text-[#37352f] dark:text-[#f6f5f4]">Opening workspace…</span></div></div>;
}

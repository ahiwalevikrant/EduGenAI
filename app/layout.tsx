import type { Metadata } from 'next';
import './globals.css';
import { JiraTopbar } from '../components/layout/jira-topbar';
import { JiraSidebar } from '../components/layout/jira-sidebar';

export const metadata: Metadata = {
  title: 'EduGen AI – Curriculum-Based AI Teaching Platform',
  description: 'AI teaching platform for board-aligned question papers, answer keys, and pedagogical PPTs powered by official NCERT, State Board, and ICSE curriculums.',
};

import { AuthGuard } from '../components/layout/auth-guard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#f6f5f4] dark:bg-[#0a1530] text-[#1a1a1a] dark:text-[#f6f5f4] antialiased selection:bg-[#5645d4]/20 selection:text-[#5645d4]">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}

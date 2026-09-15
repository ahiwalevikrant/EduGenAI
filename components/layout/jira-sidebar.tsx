'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BookOpen, 
  FileText, 
  CheckSquare, 
  Presentation, 
  Image as ImageIcon, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  FolderOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { useCurriculumStore } from '../../store/use-curriculum-store';
import { CurriculumService } from '../../services/curriculum/curriculum-service';

export function JiraSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { boardId, academicYear, classGrade, subjectId, selectedChapter } = useCurriculumStore();
  const boardInfo = CurriculumService.getBoardById(boardId);

  const navSections = [
    {
      title: 'CURRICULUM DIRECTORY',
      items: [
        { label: 'Curriculum Backlog', href: '/curriculum', icon: BookOpen },
        { label: 'Official Sources', href: '/curriculum#sources', icon: ShieldCheck, badge: 'NCERT' }
      ]
    },
    {
      title: 'GENERATION SUITE',
      items: [
        { label: 'Question Paper', href: '/generate/question-paper', icon: FileText },
        { label: 'Daily Practice (DPP)', href: '/generate/dpp', icon: Calendar, badge: 'NEW' },
        { label: 'Answer Key & Rubric', href: '/generate/answer-key', icon: CheckSquare },
        { label: 'Teaching PPT Studio', href: '/generate/ppt', icon: Presentation },
        { label: 'Educational Diagrams', href: '/generate/images', icon: ImageIcon }
      ]
    },
    {
      title: 'REPOSITORIES',
      items: [
        { label: 'Saved Artifacts', href: '/history', icon: FolderOpen }
      ]
    },
    {
      title: 'AI ENGINE CONFIG',
      items: [
        { label: 'OpenRouter & Groq', href: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-[#fafaf9] dark:bg-[#0f1c3d] border-r border-[#e5e3df] dark:border-[#243769] flex flex-col justify-between transition-all duration-150 select-none shrink-0 h-full overflow-y-auto`}>
      {/* Top: Project Info Header */}
      <div>
        <div className="p-3 border-b border-[#e5e3df] dark:border-[#243769] flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-md bg-[#5645d4] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#1a1a1a] dark:text-[#f6f5f4] truncate leading-tight">
                  {boardInfo?.name || 'CBSE Board'}
                </div>
                <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097] truncate mt-0.5">
                  Class {classGrade} • {academicYear}
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] rounded-md text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white transition-colors mx-auto cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Selected Chapter Context Widget in Sidebar */}
        {!collapsed && selectedChapter && (
          <div className="mx-3 my-2.5 p-2.5 bg-white dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] rounded-lg shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-[#787671] dark:text-[#a4a097] uppercase tracking-wider">Active Scope</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#d9f3e1] text-[#006644] font-bold uppercase">Verified</span>
            </div>
            <div className="text-xs font-bold text-[#1a1a1a] dark:text-[#f6f5f4] truncate" title={selectedChapter.title}>
              {selectedChapter.title}
            </div>
            <div className="text-[11px] text-[#5d5b54] dark:text-[#a4a097] truncate mt-0.5">
              {selectedChapter.code} • {selectedChapter.source.authority.split(' ')[0]}
            </div>
          </div>
        )}

        {/* Navigation Section Groups */}
        <div className="py-2 overflow-y-auto">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="mb-3">
              {!collapsed && (
                <div className="px-3.5 py-1 text-[10px] font-bold text-[#787671] dark:text-[#a4a097] tracking-wider">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5 px-2">
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/curriculum');
                  return (
                    <Link
                      key={iIdx}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs md:text-sm transition-colors ${
                        isActive 
                          ? 'bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] font-semibold' 
                          : 'text-[#37352f] dark:text-[#f6f5f4] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] font-normal'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#5645d4]' : 'text-[#787671] dark:text-[#a4a097]'}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          item.badge === 'NEW' 
                            ? 'bg-[#ffe8d4] text-[#793400]' 
                            : 'bg-[#d9f3e1] text-[#006644]'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding in Sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-[#e5e3df] dark:border-[#243769] text-[11px] text-[#787671] dark:text-[#a4a097] flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5645d4]" />
            <span>EduGen AI v2.4</span>
          </div>
          <span className="font-mono text-[10px]">NCERT 2026</span>
        </div>
      )}
    </aside>
  );
}

'use client';

import React from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  GraduationCap, 
  Calendar,
  ExternalLink,
  FileText,
  Presentation,
  CheckSquare,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { useCurriculumStore } from '../../store/use-curriculum-store';
import { CurriculumService, BOARDS, ACADEMIC_YEARS, CLASS_GRADES } from '../../services/curriculum/curriculum-service';
import { BoardId, AcademicYear, ClassGrade, SubjectId } from '../../services/curriculum/types';

export function CurriculumSelector() {
  const {
    boardId,
    academicYear,
    classGrade,
    subjectId,
    selectedChapterId,
    selectedChapter,
    setBoard,
    setAcademicYear,
    setClassGrade,
    setSubject,
    selectChapter
  } = useCurriculumStore();

  const subjects = CurriculumService.getSubjectsForBoardAndClass(boardId, classGrade);
  const availableChapters = CurriculumService.getChapters({
    boardId,
    academicYear,
    classGrade,
    subjectId
  });

  const currentBoard = CurriculumService.getBoardById(boardId);

  return (
    <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl shadow-sm overflow-hidden transition-colors">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-[#e5e3df] dark:border-[#243769] bg-[#f6f5f4]/60 dark:bg-[#16254c]/40">
        <div className="flex flex-wrap items-center justify-between mb-3.5 gap-2">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-[#5645d4]" />
            <h2 className="text-xs sm:text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4] uppercase tracking-wider">
              Official Curriculum Standards Selection
            </h2>
          </div>
          {currentBoard && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-[#5d5b54] dark:text-[#a4a097] font-medium">Prescribed Textbook:</span>
              <span className="font-bold text-[#1a1a1a] dark:text-[#f6f5f4] bg-white dark:bg-[#16254c] px-2.5 py-1 border border-[#e5e3df] dark:border-[#243769] rounded-md text-xs shadow-2xs">
                {currentBoard.textbookAuthority}
              </span>
            </div>
          )}
        </div>

        {/* 5 Cascading Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {/* 1. Board Selector */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              1. Board
            </label>
            <div className="relative">
              <select
                value={boardId}
                onChange={(e) => setBoard(e.target.value as BoardId)}
                className="w-full appearance-none bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] hover:border-[#5645d4] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none cursor-pointer pr-8 shadow-2xs transition-colors"
              >
                {BOARDS.map((b) => (
                  <option key={b.id} value={b.id} className="dark:bg-[#0f1c3d]">
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#787671] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Academic Year */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              2. Academic Year
            </label>
            <div className="relative">
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                className="w-full appearance-none bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] hover:border-[#5645d4] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none cursor-pointer pr-8 shadow-2xs transition-colors"
              >
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y} className="dark:bg-[#0f1c3d]">
                    {y} (Latest)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#787671] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Class */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              3. Class / Grade
            </label>
            <div className="relative">
              <select
                value={classGrade}
                onChange={(e) => setClassGrade(e.target.value as ClassGrade)}
                className="w-full appearance-none bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] hover:border-[#5645d4] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none cursor-pointer pr-8 shadow-2xs transition-colors"
              >
                {CLASS_GRADES.map((cg) => (
                  <option key={cg.grade} value={cg.grade} className="dark:bg-[#0f1c3d]">
                    {cg.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#787671] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Subject */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              4. Subject
            </label>
            <div className="relative">
              <select
                value={subjectId}
                onChange={(e) => setSubject(e.target.value as SubjectId)}
                className="w-full appearance-none bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] hover:border-[#5645d4] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none cursor-pointer pr-8 shadow-2xs transition-colors"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id} className="dark:bg-[#0f1c3d]">
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#787671] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 5. Chapter (Dynamic) */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              5. Chapter ({availableChapters.length})
            </label>
            <div className="relative">
              <select
                value={selectedChapterId || ''}
                onChange={(e) => selectChapter(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] hover:border-[#5645d4] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-bold outline-none cursor-pointer pr-8 shadow-2xs transition-colors truncate"
              >
                {availableChapters.length === 0 && (
                  <option value="">No chapters loaded</option>
                )}
                {availableChapters.map((ch) => (
                  <option key={ch.id} value={ch.id} className="dark:bg-[#0f1c3d]">
                    Ch {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#787671] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Hub for currently selected chapter */}
      {selectedChapter && (
        <div className="px-4 sm:px-5 py-3 bg-white dark:bg-[#0f1c3d] flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e3df] dark:border-[#243769]">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#5d5b54] dark:text-[#a4a097] font-semibold">Active:</span>
            <span className="text-xs font-bold text-[#5645d4] bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2.5 py-0.5 rounded">
              {selectedChapter.code}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4] truncate max-w-xs sm:max-w-md">
              {selectedChapter.title}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/generate/question-paper"
              className="flex items-center space-x-1.5 bg-[#5645d4] hover:bg-[#4534b3] text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Create Paper</span>
            </Link>

            <Link
              href="/generate/dpp"
              className="flex items-center space-x-1.5 bg-[#ffe8d4] hover:bg-[#fde0ec] text-[#dd5b00] border border-[#dd5b00]/30 text-xs font-bold px-3 py-1.5 rounded-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Generate DPP</span>
            </Link>

            <Link
              href="/generate/ppt"
              className="flex items-center space-x-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] text-[#1a1a1a] dark:text-[#f6f5f4] text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <Presentation className="w-3.5 h-3.5 text-[#2a9d99]" />
              <span>Slide Deck</span>
            </Link>

            <Link
              href="/generate/answer-key"
              className="flex items-center space-x-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] text-[#1a1a1a] dark:text-[#f6f5f4] text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5 text-[#1aae39]" />
              <span>Rubrics</span>
            </Link>

            <Link
              href="/generate/images"
              className="flex items-center space-x-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] text-[#1a1a1a] dark:text-[#f6f5f4] text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#7b3ff2]" />
              <span>Diagrams</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Presentation, 
  CheckSquare, 
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useCurriculumStore } from '../../store/use-curriculum-store';
import { CurriculumService } from '../../services/curriculum/curriculum-service';
import { CurriculumSelector } from '../../components/curriculum/curriculum-selector';
import { ChapterPreviewCard } from '../../components/curriculum/chapter-preview-card';

export default function CurriculumPage() {
  const { selectedChapter, selectChapter, searchQuery, setSearchQuery, boardId, classGrade, subjectId, academicYear } = useCurriculumStore();
  const allChapters = CurriculumService.getAllChapters();

  const filteredChapters = searchQuery.trim() 
    ? CurriculumService.searchChapters(searchQuery)
    : allChapters;

  const currentSubjectChapters = CurriculumService.getChapters({
    boardId,
    academicYear,
    classGrade,
    subjectId
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl p-5 md:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-[#5645d4]" />
            <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">
              Curriculum Directory & Textbook Catalog
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#5d5b54] dark:text-[#a4a097] mt-1">
            Browse verified chapters from CBSE (NCERT), Maharashtra State Board (Balbharati), and ICSE (CISCE).
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all topics & chapters..."
            className="w-full bg-[#f6f5f4] dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md text-sm py-2 pl-9 pr-3 text-[#1a1a1a] dark:text-[#f6f5f4] outline-none transition-all placeholder:text-[#a4a097] shadow-2xs"
          />
        </div>
      </div>

      {/* Curriculum Cascading Selector */}
      <CurriculumSelector />

      {/* Main Chapter Content View */}
      {selectedChapter ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs md:text-sm font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider">
              Selected Chapter Details & Syllabus Grounding
            </h2>
          </div>
          <ChapterPreviewCard chapter={selectedChapter} />
        </div>
      ) : (
        <div className="p-10 text-center bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl text-[#5d5b54] dark:text-[#a4a097] text-sm">
          Select a chapter from the selector above to inspect official syllabus and learning objectives.
        </div>
      )}

      {/* Chapters in Current Subject Grid */}
      {!searchQuery.trim() && currentSubjectChapters.length > 0 && (
        <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl p-5 md:p-6 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider">
              All Chapters in {boardId.toUpperCase()} Class {classGrade} {subjectId.toUpperCase()} ({currentSubjectChapters.length} Chapters)
            </h3>
            <span className="text-xs text-[#5d5b54] dark:text-[#a4a097]">Click any chapter to inspect and generate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSubjectChapters.map((ch) => {
              const isSelected = selectedChapter?.id === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => selectChapter(ch.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'border-[#5645d4] ring-2 ring-[#5645d4]/20 bg-[#e6e0f5]/20 dark:bg-[#5645d4]/10'
                      : 'border-[#e5e3df] dark:border-[#243769] bg-[#f6f5f4]/40 dark:bg-[#16254c] hover:border-[#5645d4] hover:bg-[#e6e0f5]/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#5645d4] bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2 py-0.5 rounded">
                      Ch {ch.chapterNumber}: {ch.code}
                    </span>
                    <span className="text-[10px] font-semibold text-[#006644] bg-[#d9f3e1] px-2 py-0.5 rounded">
                      {ch.source.authority.split(' ')[0]}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4] leading-tight">{ch.title}</h4>
                  <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] line-clamp-2 leading-relaxed">{ch.tagline}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#e5e3df] dark:border-[#243769] text-xs">
                    <span className="text-[#787671] dark:text-[#a4a097] font-medium">{ch.assessmentWeightage || 'Board Aligned'}</span>
                    <span className="font-bold text-[#5645d4] flex items-center space-x-1">
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

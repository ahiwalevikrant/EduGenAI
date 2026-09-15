'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  FileText, 
  Presentation, 
  CheckSquare, 
  Image as ImageIcon, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  Layers,
  Zap,
  Star
} from 'lucide-react';
import { useCurriculumStore } from '../store/use-curriculum-store';
import { useSettingsStore } from '../store/use-settings-store';
import { useHistoryStore } from '../store/use-history-store';
import { CurriculumSelector } from '../components/curriculum/curriculum-selector';
import { ChapterPreviewCard } from '../components/curriculum/chapter-preview-card';
import { CurriculumService } from '../services/curriculum/curriculum-service';

export default function DashboardPage() {
  const { boardId, academicYear, classGrade, subjectId, selectedChapter, selectChapter } = useCurriculumStore();
  const { activeProvider } = useSettingsStore();
  const { papers, pptDecks, answerKeys } = useHistoryStore();

  const allChapters = CurriculumService.getAllChapters();
  const recentChapters = allChapters.slice(0, 4);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* 1. NOTION-STYLE HERO BAND */}
      <div className="bg-[#0a1530] text-white rounded-xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-xl border border-[#1a2a52]">
        {/* Subtle decorative mesh background dots */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#5645d4]/20 via-[#2a9d99]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#1a2a52] border border-[#243769] px-3 py-1 rounded-full text-xs font-semibold text-[#f5d75e]">
            <Sparkles className="w-3.5 h-3.5 text-[#f5d75e]" />
            <span>Curriculum Grounded AI Workspace • NCERT & State Boards</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            Meet your curriculum-aligned AI teaching assistant.
          </h1>

          <p className="text-sm sm:text-base text-[#a4a097] leading-relaxed max-w-2xl">
            Select standard school textbooks (CBSE, Maharashtra, ICSE) and generate classroom-ready examination papers, daily practice plans (DPP), presentation decks, and marking rubrics without manual file uploads.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/generate/question-paper"
              className="bg-[#5645d4] hover:bg-[#4534b3] text-white font-medium text-sm px-5 py-2.5 rounded-md transition-colors flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Create Question Paper</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/generate/dpp"
              className="bg-[#1a2a52] hover:bg-[#243769] text-white border border-[#243769] font-medium text-sm px-4 py-2.5 rounded-md transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#f5d75e]" />
              <span>Generate DPP Plans</span>
            </Link>

            <div className="flex items-center space-x-2 text-xs text-[#a4a097] pl-2">
              <ShieldCheck className="w-4 h-4 text-[#1aae39]" />
              <span>Grounded in Official Syllabus</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CURRICULUM SELECTOR STAGE */}
      <CurriculumSelector />

      {/* 3. NOTION-STYLE PASTEL FEATURE TILES */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-xs md:text-sm font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider">
            Generation Suite Modules
          </h2>
          <span className="text-xs text-[#5d5b54] dark:text-[#a4a097]">
            Active: <strong className="text-[#1a1a1a] dark:text-[#f6f5f4]">{selectedChapter?.title || 'None'}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Tile 1: Question Papers (Sky Blue Tint) */}
          <Link
            href="/generate/question-paper"
            className="group bg-[#dcecfa] dark:bg-[#0f1c3d] border border-[#c8c4be]/50 dark:border-[#243769] hover:border-[#0075de] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#16254c] text-[#0075de] flex items-center justify-center mb-3 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4] group-hover:text-[#0075de] transition-colors">
                Question Papers
              </h3>
              <p className="text-xs text-[#37352f] dark:text-[#a4a097] mt-1.5 leading-relaxed">
                Full-length CBSE & State Board exam blueprints (Section A–E) with DOCX export.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-black/10 dark:border-[#243769] text-xs font-bold text-[#0075de]">
              <span>Create Paper</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 2: Daily Practice DPP (Peach Tint) */}
          <Link
            href="/generate/dpp"
            className="group bg-[#ffe8d4] dark:bg-[#0f1c3d] border border-[#c8c4be]/50 dark:border-[#243769] hover:border-[#dd5b00] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ring-1 ring-[#dd5b00]/20"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#16254c] text-[#dd5b00] flex items-center justify-center mb-3 shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4] group-hover:text-[#dd5b00] transition-colors">
                  Daily Practice (DPP)
                </h3>
                <span className="text-[9px] bg-[#dd5b00] text-white font-bold px-1.5 py-0.5 rounded">NEW</span>
              </div>
              <p className="text-xs text-[#37352f] dark:text-[#a4a097] mt-1.5 leading-relaxed">
                1–5 day practice sheets with step solutions, hints, and printable worksheets.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-black/10 dark:border-[#243769] text-xs font-bold text-[#dd5b00]">
              <span>Generate DPP</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 3: Teaching PPT Studio (Mint Tint) */}
          <Link
            href="/generate/ppt"
            className="group bg-[#d9f3e1] dark:bg-[#0f1c3d] border border-[#c8c4be]/50 dark:border-[#243769] hover:border-[#1aae39] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#16254c] text-[#1aae39] flex items-center justify-center mb-3 shadow-xs">
                <Presentation className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4] group-hover:text-[#1aae39] transition-colors">
                Teaching PPT Studio
              </h3>
              <p className="text-xs text-[#37352f] dark:text-[#a4a097] mt-1.5 leading-relaxed">
                Canva-style 3-panel slide masterclass editor with direct editable PPTX download.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-black/10 dark:border-[#243769] text-xs font-bold text-[#1aae39]">
              <span>Open Studio</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 4: Answer Keys & Rubrics (Lavender Tint) */}
          <Link
            href="/generate/answer-key"
            className="group bg-[#e6e0f5] dark:bg-[#0f1c3d] border border-[#c8c4be]/50 dark:border-[#243769] hover:border-[#5645d4] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#16254c] text-[#5645d4] flex items-center justify-center mb-3 shadow-xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4] group-hover:text-[#5645d4] transition-colors">
                Marking Rubrics
              </h3>
              <p className="text-xs text-[#37352f] dark:text-[#a4a097] mt-1.5 leading-relaxed">
                Step-by-step evaluator solutions, marking allocations, and student pitfall warnings.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-black/10 dark:border-[#243769] text-xs font-bold text-[#5645d4]">
              <span>View Rubrics</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Tile 5: Diagrams & Visuals (Yellow Tint) */}
          <Link
            href="/generate/images"
            className="group bg-[#fef7d6] dark:bg-[#0f1c3d] border border-[#c8c4be]/50 dark:border-[#243769] hover:border-[#f5d75e] rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#16254c] text-[#dd5b00] flex items-center justify-center mb-3 shadow-xs">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4] group-hover:text-[#dd5b00] transition-colors">
                Vector Diagrams
              </h3>
              <p className="text-xs text-[#37352f] dark:text-[#a4a097] mt-1.5 leading-relaxed">
                High-contrast SVG science schematics and formula flowcharts for slides.
              </p>
            </div>
            <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-black/10 dark:border-[#243769] text-xs font-bold text-[#dd5b00]">
              <span>Draw Diagrams</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. ACTIVE CHAPTER PREVIEW */}
      {selectedChapter && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xs md:text-sm font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider">
              Active Chapter Official Content
            </h2>
            <Link
              href="/curriculum"
              className="text-xs md:text-sm text-[#5645d4] hover:underline font-semibold"
            >
              Browse Full Catalog →
            </Link>
          </div>
          <ChapterPreviewCard chapter={selectedChapter} />
        </div>
      )}

      {/* 5. QUICK CHAPTER PICKER CARDS */}
      <div>
        <h2 className="text-xs md:text-sm font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-3.5">
          Quick Chapter Jump
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentChapters.map((ch) => (
            <div
              key={ch.id}
              onClick={() => selectChapter(ch.id)}
              className={`p-4 rounded-xl border bg-white dark:bg-[#0f1c3d] cursor-pointer transition-all ${
                selectedChapter?.id === ch.id
                  ? 'border-[#5645d4] ring-2 ring-[#5645d4]/20 bg-[#e6e0f5]/20 dark:bg-[#5645d4]/10'
                  : 'border-[#e5e3df] dark:border-[#243769] hover:border-[#c8c4be] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold bg-[#f6f5f4] dark:bg-[#16254c] px-2 py-0.5 rounded text-[#5d5b54] dark:text-[#a4a097]">
                  {ch.code}
                </span>
                <span className="text-[10px] font-bold text-[#006644] bg-[#d9f3e1] px-2 py-0.5 rounded">
                  {ch.source.authority.split(' ')[0]}
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4] truncate">{ch.title}</h4>
              <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] truncate mt-1">
                Class {ch.classGrade} {ch.subjectId.toUpperCase()} • {ch.assessmentWeightage}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

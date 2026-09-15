'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  BookOpen, 
  Target, 
  CheckCircle, 
  FlaskConical, 
  Calculator, 
  HelpCircle,
  FileCheck,
  Calendar,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { Chapter } from '../../services/curriculum/types';

interface Props {
  chapter: Chapter;
}

export function ChapterPreviewCard({ chapter }: Props) {
  const [activeTab, setActiveTab] = useState<'concepts' | 'objectives' | 'activities' | 'terms'>('concepts');

  return (
    <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl shadow-sm overflow-hidden transition-colors">
      {/* Chapter Official Header */}
      <div className="p-5 sm:p-6 md:p-7 border-b border-[#e5e3df] dark:border-[#243769] bg-white dark:bg-[#0f1c3d]">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            {/* Breadcrumb & Key */}
            <div className="flex items-center space-x-2 text-xs mb-2">
              <span className="font-mono font-bold bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] px-2.5 py-0.5 rounded">
                {chapter.code}
              </span>
              <span className="text-[#a4a097]">•</span>
              <span className="text-[#5d5b54] dark:text-[#a4a097] font-bold uppercase tracking-wider text-[11px]">
                {chapter.boardId.toUpperCase()} • Class {chapter.classGrade} • {chapter.subjectId.toUpperCase()}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a1a1a] dark:text-[#f6f5f4] leading-tight">
              Chapter {chapter.chapterNumber}: {chapter.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#5d5b54] dark:text-[#a4a097] mt-1.5 max-w-3xl leading-relaxed">
              {chapter.tagline}
            </p>
          </div>

          {/* Source Verification Badge & View Source CTA */}
          <div className="flex flex-col items-end space-y-2 shrink-0">
            <div className="flex items-center space-x-1.5 bg-[#d9f3e1] text-[#006644] px-3 py-1 rounded-md text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#1aae39]" />
              <span>Verified Source: {chapter.source.authority.split(' ')[0]}</span>
            </div>

            <a
              href={chapter.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-[#0075de] hover:underline font-semibold"
            >
              <span>View Textbook Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Source Metadata Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5 border-t border-[#e5e3df] dark:border-[#243769] text-xs">
          <div>
            <span className="text-[#787671] dark:text-[#a4a097] text-[11px] uppercase font-bold block">Authority</span>
            <span className="font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]">{chapter.source.authority}</span>
          </div>
          <div>
            <span className="text-[#787671] dark:text-[#a4a097] text-[11px] uppercase font-bold block">Textbook</span>
            <span className="font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]">{chapter.source.bookTitle}</span>
          </div>
          <div>
            <span className="text-[#787671] dark:text-[#a4a097] text-[11px] uppercase font-bold block">Edition</span>
            <span className="font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]">{chapter.source.publicationYear}</span>
          </div>
          <div>
            <span className="text-[#787671] dark:text-[#a4a097] text-[11px] uppercase font-bold block">Status</span>
            <span className="font-semibold text-[#1a1a1a] dark:text-[#f6f5f4] flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#1aae39]" />
              <span>{chapter.source.verifiedDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap border-b border-[#e5e3df] dark:border-[#243769] bg-[#f6f5f4]/60 dark:bg-[#16254c]/40 px-4 sm:px-6">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'concepts'
              ? 'border-[#5645d4] text-[#5645d4] bg-white dark:bg-[#0f1c3d]'
              : 'border-transparent text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Core Concepts ({(chapter.coreConcepts || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('objectives')}
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'objectives'
              ? 'border-[#5645d4] text-[#5645d4] bg-white dark:bg-[#0f1c3d]'
              : 'border-transparent text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Learning Objectives ({(chapter.learningObjectives || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'activities'
              ? 'border-[#5645d4] text-[#5645d4] bg-white dark:bg-[#0f1c3d]'
              : 'border-transparent text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Labs & Activities ({(chapter.activities || []).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            activeTab === 'terms'
              ? 'border-[#5645d4] text-[#5645d4] bg-white dark:bg-[#0f1c3d]'
              : 'border-transparent text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Key Terms & Definitions ({(chapter.importantTerms || []).length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6 md:p-7">
        {/* PANEL 1: Core Concepts */}
        {activeTab === 'concepts' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(chapter.coreConcepts || []).map((concept, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl border border-[#e5e3df] dark:border-[#243769] bg-white dark:bg-[#16254c] shadow-2xs space-y-2 hover:border-[#5645d4]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#5645d4] bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2 py-0.5 rounded">
                      Concept {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{concept.title}</h3>
                  <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] leading-relaxed">{concept.summary}</p>
                  {concept.keyPoints && concept.keyPoints.length > 0 && (
                    <ul className="text-xs text-[#5d5b54] dark:text-[#a4a097] list-disc list-inside space-y-1 pt-1">
                      {concept.keyPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  )}
                  {concept.formulas && concept.formulas.length > 0 && (
                    <div className="p-2 rounded bg-[#f6f5f4] dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] font-mono text-xs text-[#5645d4] font-bold space-y-1">
                      {concept.formulas.map((f, fIdx) => (
                        <div key={fIdx}>{f}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 2: Learning Objectives */}
        {activeTab === 'objectives' && (
          <div className="space-y-3">
            {(chapter.learningObjectives || []).map((obj, idx) => (
              <div 
                key={idx}
                className="flex items-start space-x-3 p-3.5 rounded-xl border border-[#e5e3df] dark:border-[#243769] bg-white dark:bg-[#16254c]"
              >
                <CheckCircle className="w-4 h-4 text-[#1aae39] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-[#1a1a1a] dark:text-[#f6f5f4] leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        )}

        {/* PANEL 3: Activities */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            {(chapter.activities || []).length === 0 ? (
              <div className="p-6 text-center text-xs text-[#787671] dark:text-[#a4a097]">
                No mandatory laboratory experiments listed for this chapter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(chapter.activities || []).map((act, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-[#e5e3df] dark:border-[#243769] bg-[#ffe8d4]/30 dark:bg-[#16254c] space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <FlaskConical className="w-4 h-4 text-[#dd5b00]" />
                      <span className="font-mono text-xs font-bold text-[#dd5b00]">
                        {act.activityNumber || `Activity ${idx + 1}`}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{act.title}</h4>
                    <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] leading-relaxed">{act.objective}</p>
                    {act.conclusion && (
                      <div className="text-xs text-[#793400] dark:text-[#f9e79f] font-medium bg-[#ffe8d4] dark:bg-[#243769] p-2 rounded">
                        <strong>Outcome: </strong>{act.conclusion}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL 4: Terms */}
        {activeTab === 'terms' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(chapter.importantTerms || []).map((term, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-[#e5e3df] dark:border-[#243769] bg-white dark:bg-[#16254c]">
                  <strong className="text-xs font-bold text-[#5645d4] block mb-1">{term.term}</strong>
                  <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] leading-relaxed">{term.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

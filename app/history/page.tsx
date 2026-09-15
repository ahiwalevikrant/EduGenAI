'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderOpen, 
  FileText, 
  Presentation, 
  CheckSquare, 
  Trash2, 
  Download, 
  Printer, 
  ExternalLink,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useHistoryStore } from '../../store/use-history-store';
import { DocxExporter } from '../../services/export/docx-exporter';
import { PPTXExporter } from '../../services/ppt/pptx-exporter';

export default function HistoryPage() {
  const { papers, pptDecks, answerKeys, deletePaper, deletePPTDeck, deleteAnswerKey } = useHistoryStore();
  const [activeTab, setActiveTab] = useState<'papers' | 'decks' | 'keys'>('papers');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl p-5 md:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2.5">
            <FolderOpen className="w-5 h-5 text-[#5645d4]" />
            <h1 className="text-xl md:text-2xl font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">
              Saved Artifacts & Repository
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#5d5b54] dark:text-[#a4a097] mt-1">
            Access, export, and review your generated question papers, slide decks, and marking schemes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f6f5f4] dark:bg-[#16254c] p-1 rounded-md border border-[#e5e3df] dark:border-[#243769] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('papers')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'papers' ? 'bg-white dark:bg-[#0f1c3d] text-[#5645d4] shadow-2xs font-bold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Papers ({papers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('decks')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'decks' ? 'bg-white dark:bg-[#0f1c3d] text-[#2a9d99] shadow-2xs font-bold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Slide Decks ({pptDecks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'keys' ? 'bg-white dark:bg-[#0f1c3d] text-[#1aae39] shadow-2xs font-bold' : 'text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Answer Keys ({answerKeys.length})</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl shadow-sm overflow-hidden transition-colors">
        {/* PAPERS TAB */}
        {activeTab === 'papers' && (
          <div>
            {papers.length === 0 ? (
              <div className="p-12 text-center text-[#5d5b54] dark:text-[#a4a097] text-sm space-y-3">
                <FileText className="w-9 h-9 text-[#a4a097] mx-auto" />
                <p className="font-medium text-[#1a1a1a] dark:text-[#f6f5f4]">No question papers saved yet.</p>
                <Link
                  href="/generate/question-paper"
                  className="inline-block bg-[#5645d4] text-white px-4 py-2 rounded-md font-medium hover:bg-[#4534b3] text-xs shadow-sm"
                >
                  Create Your First Question Paper
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#e5e3df] dark:divide-[#243769]">
                {papers.map((paper) => (
                  <div key={paper.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#f6f5f4]/50 dark:hover:bg-[#16254c]/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#5645d4] bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2 py-0.5 rounded">
                          {paper.boardName} • C{paper.classGrade}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{paper.title}</h3>
                      </div>
                      <p className="text-xs text-[#5d5b54] dark:text-[#a4a097]">
                        {paper.chapterTitle} • {paper.totalMarks} Marks • {paper.durationMinutes} Mins • {new Date(paper.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => DocxExporter.exportQuestionPaper(paper)}
                        className="flex items-center space-x-1 bg-white dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] px-3 py-1.5 rounded-md text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4] transition-colors shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#5645d4]" />
                        <span>DOCX</span>
                      </button>

                      <Link
                        href={`/generate/answer-key?paperId=${paper.id}`}
                        className="flex items-center space-x-1 bg-[#d9f3e1] hover:bg-[#d9f3e1]/80 text-[#006644] px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Marking Scheme</span>
                      </Link>

                      <button
                        onClick={() => deletePaper(paper.id)}
                        className="p-1.5 hover:bg-[#fde0ec] rounded-md text-[#787671] hover:text-[#e03131] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PPT DECKS TAB */}
        {activeTab === 'decks' && (
          <div>
            {pptDecks.length === 0 ? (
              <div className="p-12 text-center text-[#5d5b54] dark:text-[#a4a097] text-sm space-y-3">
                <Presentation className="w-9 h-9 text-[#a4a097] mx-auto" />
                <p className="font-medium text-[#1a1a1a] dark:text-[#f6f5f4]">No presentation decks saved yet.</p>
                <Link
                  href="/generate/ppt"
                  className="inline-block bg-[#5645d4] text-white px-4 py-2 rounded-md font-medium hover:bg-[#4534b3] text-xs shadow-sm"
                >
                  Generate First Slide Deck
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#e5e3df] dark:divide-[#243769]">
                {pptDecks.map((deck) => (
                  <div key={deck.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#f6f5f4]/50 dark:hover:bg-[#16254c]/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#2a9d99] bg-[#dcecfa] dark:bg-[#2a9d99]/20 px-2 py-0.5 rounded">
                          {deck.slides.length} Slides
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{deck.title}</h3>
                      </div>
                      <p className="text-xs text-[#5d5b54] dark:text-[#a4a097]">
                        {deck.chapterTitle} • Style: {deck.teachingStyle} • Theme: {deck.themeId} • {new Date(deck.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => PPTXExporter.exportToPPTX(deck)}
                        className="flex items-center space-x-1 bg-[#5645d4] hover:bg-[#4534b3] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export PPTX</span>
                      </button>

                      <button
                        onClick={() => deletePPTDeck(deck.id)}
                        className="p-1.5 hover:bg-[#fde0ec] rounded-md text-[#787671] hover:text-[#e03131] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANSWER KEYS TAB */}
        {activeTab === 'keys' && (
          <div>
            {answerKeys.length === 0 ? (
              <div className="p-12 text-center text-[#5d5b54] dark:text-[#a4a097] text-sm space-y-3">
                <CheckSquare className="w-9 h-9 text-[#a4a097] mx-auto" />
                <p className="font-medium text-[#1a1a1a] dark:text-[#f6f5f4]">No marking schemes saved yet.</p>
                <Link
                  href="/generate/answer-key"
                  className="inline-block bg-[#1aae39] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1aae39]/90 text-xs shadow-sm"
                >
                  Generate Marking Scheme
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#e5e3df] dark:divide-[#243769]">
                {answerKeys.map((key) => (
                  <div key={key.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#f6f5f4]/50 dark:hover:bg-[#16254c]/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-[#006644] bg-[#d9f3e1] px-2 py-0.5 rounded">
                          {key.items.length} Solutions
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{key.paperTitle}</h3>
                      </div>
                      <p className="text-xs text-[#5d5b54] dark:text-[#a4a097]">
                        {key.chapterTitle} • Max Marks: {key.totalMarks} • {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => DocxExporter.exportAnswerKey(key)}
                        className="flex items-center space-x-1 bg-white dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] px-3 py-1.5 rounded-md text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4] transition-colors shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#5645d4]" />
                        <span>DOCX</span>
                      </button>

                      <button
                        onClick={() => deleteAnswerKey(key.id)}
                        className="p-1.5 hover:bg-[#fde0ec] rounded-md text-[#787671] hover:text-[#e03131] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

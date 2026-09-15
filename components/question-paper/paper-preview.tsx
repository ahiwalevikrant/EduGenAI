'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  CheckSquare, 
  Edit3, 
  Check, 
  Save, 
  Sparkles, 
  Layers, 
  Share2, 
  Trash2, 
  Plus 
} from 'lucide-react';
import Link from 'next/link';
import { GeneratedQuestionPaper, QuestionItem } from '../../services/question-paper/types';
import { DocxExporter } from '../../services/export/docx-exporter';
import { useHistoryStore } from '../../store/use-history-store';

interface Props {
  paper: GeneratedQuestionPaper;
  onGenerateAnswerKey?: () => void;
}

export function PaperPreviewView({ paper: initialPaper, onGenerateAnswerKey }: Props) {
  const [paper, setPaper] = useState<GeneratedQuestionPaper>(initialPaper);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const { savePaper } = useHistoryStore();

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    await DocxExporter.exportQuestionPaper(paper);
  };

  const handleSaveToHistory = () => {
    savePaper(paper);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const updateQuestionText = (sectionIdx: number, qIdx: number, text: string) => {
    setPaper(prev => {
      const nextSections = [...prev.sections];
      nextSections[sectionIdx].questions[qIdx].questionText = text;
      return { ...prev, sections: nextSections };
    });
  };

  const updateQuestionMarks = (sectionIdx: number, qIdx: number, marks: number) => {
    setPaper(prev => {
      const nextSections = [...prev.sections];
      nextSections[sectionIdx].questions[qIdx].marks = marks;
      const newTotal = nextSections.flatMap(s => s.questions).reduce((acc, q) => acc + q.marks, 0);
      return { ...prev, sections: nextSections, totalMarks: newTotal };
    });
  };

  return (
    <div className="space-y-5">
      {/* Action Header Toolbar */}
      <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden transition-colors">
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs font-bold bg-[#e6e0f5] dark:bg-[#5645d4]/20 text-[#5645d4] px-2.5 py-0.5 rounded">
            {paper.boardName} • {paper.academicYear}
          </span>
          <span className="text-sm sm:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{paper.title}</span>
          <span className="text-xs text-[#5d5b54] dark:text-[#a4a097] font-semibold">({paper.totalMarks} Marks)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
              isEditing 
                ? 'bg-[#fef7d6] border-[#dd5b00] text-[#793400]' 
                : 'bg-white dark:bg-[#16254c] border-[#e5e3df] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] text-[#1a1a1a] dark:text-[#f6f5f4]'
            }`}
          >
            {isEditing ? <Check className="w-3.5 h-3.5 text-[#1aae39]" /> : <Edit3 className="w-3.5 h-3.5 text-[#5645d4]" />}
            <span>{isEditing ? 'Done Editing' : 'Edit Questions'}</span>
          </button>

          <button
            onClick={handleSaveToHistory}
            className="flex items-center space-x-1.5 bg-white dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] px-3 py-1.5 rounded-md text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4] transition-colors shadow-2xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#787671]" />
            <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={handleExportDocx}
            className="flex items-center space-x-1.5 bg-white dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a] px-3 py-1.5 rounded-md text-xs font-semibold text-[#1a1a1a] dark:text-[#f6f5f4] transition-colors shadow-2xs cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#5645d4]" />
            <span>Export DOCX</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-[#5645d4] hover:bg-[#4534b3] text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          {onGenerateAnswerKey && (
            <button
              onClick={onGenerateAnswerKey}
              className="flex items-center space-x-1.5 bg-[#1aae39] hover:bg-[#1aae39]/90 text-white px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Marking Scheme</span>
            </button>
          )}
        </div>
      </div>

      {/* Authentic Printable Question Paper Document */}
      <div id="printable-paper" className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl shadow-sm p-6 sm:p-10 md:p-12 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 transition-colors">
        {/* Header */}
        <div className="text-center border-b-2 border-[#1a1a1a] dark:border-[#f6f5f4] pb-5 mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1a1a1a] dark:text-[#f6f5f4] uppercase tracking-wide">
            {paper.schoolName}
          </h1>
          <h2 className="text-base sm:text-lg font-bold text-[#1a1a1a] dark:text-[#f6f5f4] mt-1">
            {paper.title} ({paper.academicYear})
          </h2>
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4] mt-4 pt-2 border-t border-[#e5e3df] dark:border-[#243769]">
            <span>CLASS: {paper.classGrade} ({paper.subjectName.toUpperCase()})</span>
            <span>TIME ALLOWED: {paper.durationMinutes} MINUTES</span>
            <span>MAXIMUM MARKS: {paper.totalMarks}</span>
          </div>
        </div>

        {/* General Instructions */}
        <div className="bg-[#f6f5f4]/80 dark:bg-[#16254c]/60 border border-[#e5e3df] dark:border-[#243769] p-4 rounded-lg mb-6 text-xs text-[#37352f] dark:text-[#f6f5f4] space-y-1.5">
          <div className="font-bold text-[#1a1a1a] dark:text-[#f6f5f4] uppercase tracking-wider mb-1">
            General Instructions:
          </div>
          <ol className="list-decimal pl-4 space-y-1 text-[#5d5b54] dark:text-[#a4a097] leading-relaxed">
            {paper.generalInstructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* Sections and Questions */}
        <div className="space-y-8">
          {paper.sections.map((section, sIdx) => (
            <div key={section.id || sIdx} className="space-y-4">
              {/* Section Header */}
              <div className="text-center border-b border-[#e5e3df] dark:border-[#243769] pb-2">
                <h3 className="font-bold text-sm sm:text-base text-[#1a1a1a] dark:text-[#f6f5f4] uppercase tracking-wider">
                  {section.sectionName}
                </h3>
                <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] italic mt-0.5">
                  {section.description} ({section.totalQuestions} Questions • {section.sectionMarks} Marks)
                </p>
              </div>

              {/* Questions within section */}
              <div className="space-y-4">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id || qIdx} className="space-y-2 group">
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <div className="flex-1 flex items-start space-x-2">
                        <span className="font-bold text-[#1a1a1a] dark:text-[#f6f5f4] min-w-[28px]">
                          Q{q.qNumber}.
                        </span>

                        {isEditing ? (
                          <textarea
                            value={q.questionText}
                            onChange={(e) => updateQuestionText(sIdx, qIdx, e.target.value)}
                            className="w-full bg-[#f6f5f4] dark:bg-[#16254c] border border-[#5645d4] p-2 rounded text-sm text-[#1a1a1a] dark:text-[#f6f5f4] outline-none"
                            rows={2}
                          />
                        ) : (
                          <span className="text-sm font-medium text-[#1a1a1a] dark:text-[#f6f5f4] leading-relaxed whitespace-pre-line">
                            {q.questionText}
                          </span>
                        )}
                      </div>

                      {/* Marks */}
                      <div className="shrink-0 flex items-center space-x-2">
                        {isEditing ? (
                          <input
                            type="number"
                            value={q.marks}
                            onChange={(e) => updateQuestionMarks(sIdx, qIdx, parseInt(e.target.value) || 1)}
                            className="w-12 text-center bg-[#f6f5f4] dark:bg-[#16254c] border border-[#5645d4] rounded py-0.5 text-xs font-mono font-bold"
                          />
                        ) : (
                          <span className="font-bold text-xs font-mono text-[#1a1a1a] dark:text-[#f6f5f4]">
                            [{q.marks}]
                          </span>
                        )}
                      </div>
                    </div>

                    {/* MCQ Options if present */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1 text-xs sm:text-sm text-[#37352f] dark:text-[#a4a097]">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="font-medium">
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Paper End Stamp */}
        <div className="text-center text-xs font-bold uppercase tracking-widest text-[#787671] dark:text-[#a4a097] pt-10 border-t border-[#e5e3df] dark:border-[#243769] mt-10">
          *** END OF QUESTION PAPER ***
        </div>
      </div>
    </div>
  );
}

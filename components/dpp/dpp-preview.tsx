'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Award,
  FileText
} from 'lucide-react';
import { DPPPlan, DPPDayPlan, DPPQuestion } from '../../services/dpp/types';
import { exportDocxFile } from '../../services/export/docx-exporter';

interface Props {
  dppPlan: DPPPlan;
}

export function DPPPreview({ dppPlan }: Props) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const currentDay: DPPDayPlan = dppPlan.days[activeDayIndex] || dppPlan.days[0];

  const toggleSolution = (id: string) => {
    setExpandedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    let text = `# ${dppPlan.title}\n`;
    text += `Board: ${dppPlan.boardId.toUpperCase()} | Class: ${dppPlan.classGrade} | Subject: ${dppPlan.subjectId}\n\n`;
    
    dppPlan.days.forEach(day => {
      text += `## ${day.dayTitle} (Time: ${day.estimatedMinutes} mins, Marks: ${day.totalMarks})\n`;
      text += `Focus Concept: ${day.focusConcept}\n\n`;
      day.questions.forEach(q => {
        text += `Q${q.questionNumber}. [${q.type.toUpperCase()}] (${q.marks} Mark${q.marks > 1 ? 's' : ''})\n${q.questionText}\n`;
        if (q.options) {
          q.options.forEach(opt => { text += `   ${opt}\n`; });
        }
        text += `Correct Answer: ${q.correctAnswer}\n`;
        text += `Solution:\n${q.solutionSteps.map(s => `  - ${s}`).join('\n')}\n\n`;
      });
      text += '\n---\n\n';
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    const paperForDocx: any = {
      header: {
        schoolName: 'EDUCATIONAL PRACTICE WORKSHEET',
        examName: dppPlan.title,
        academicYear: dppPlan.academicYear,
        classGrade: dppPlan.classGrade,
        subject: dppPlan.subjectId.toUpperCase(),
        chapterName: dppPlan.chapterTitle,
        board: dppPlan.boardId.toUpperCase(),
        timeAllowedMinutes: currentDay.estimatedMinutes,
        maximumMarks: currentDay.totalMarks,
        generalInstructions: [
          `Daily Practice Plan - ${currentDay.dayTitle}`,
          `Focus Concept: ${currentDay.focusConcept}`,
          `All questions are compulsory.`
        ]
      },
      sections: [
        {
          sectionName: `Section A - ${currentDay.dayTitle}`,
          totalQuestions: currentDay.questions.length,
          sectionMarks: currentDay.totalMarks,
          questions: currentDay.questions.map(q => ({
            questionNumber: q.questionNumber,
            type: q.type,
            text: q.questionText,
            options: q.options,
            marks: q.marks,
            correctAnswer: q.correctAnswer,
            explanation: q.solutionSteps.join('\n')
          }))
        }
      ]
    };

    await exportDocxFile(paperForDocx, `${dppPlan.chapterCode}_${currentDay.dayTitle.replace(/[^a-zA-Z0-9]/g, '_')}.docx`);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl p-4 sm:p-5 shadow-sm flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center space-x-2.5">
          <Calendar className="w-5 h-5 text-[#5645d4]" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">{dppPlan.title}</h3>
            <p className="text-xs text-[#5d5b54] dark:text-[#a4a097]">
              {dppPlan.boardId.toUpperCase()} • Class {dppPlan.classGrade} • {dppPlan.totalDays} Days • {dppPlan.totalQuestions} Total Questions ({dppPlan.totalMarks} Marks)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAllSolutions(!showAllSolutions)}
            className="flex items-center space-x-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] text-[#1a1a1a] dark:text-[#f6f5f4] text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            {showAllSolutions ? <EyeOff className="w-3.5 h-3.5 text-[#787671]" /> : <Eye className="w-3.5 h-3.5 text-[#5645d4]" />}
            <span>{showAllSolutions ? 'Hide Solutions' : 'Reveal Solutions'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] text-[#1a1a1a] dark:text-[#f6f5f4] text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1aae39]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Plan'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-[#f6f5f4] dark:bg-[#16254c] hover:bg-[#ede9e4] dark:hover:bg-[#1d2e5a] border border-[#e5e3df] dark:border-[#243769] text-[#1a1a1a] dark:text-[#f6f5f4] text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <button
            onClick={handleExportDocx}
            className="flex items-center space-x-1.5 bg-[#5645d4] hover:bg-[#4534b3] text-white text-xs font-medium px-3.5 py-1.5 rounded-md transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DOCX</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex border-b border-[#e5e3df] dark:border-[#243769] bg-white dark:bg-[#0f1c3d] rounded-t-xl px-2 overflow-x-auto print:hidden shadow-2xs">
        {dppPlan.days.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'border-[#5645d4] text-[#5645d4] bg-[#e6e0f5]/20 dark:bg-[#5645d4]/10'
                  : 'border-transparent text-[#5d5b54] dark:text-[#a4a097] hover:text-[#1a1a1a] dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{day.dayTitle.split(':')[0]}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#f6f5f4] dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769]">
                {day.questions.length} Qs
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Worksheet Container */}
      <div id="printable-paper" className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-b-xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
        {/* Printable Worksheet Header */}
        <div className="border-b-2 border-[#e5e3df] dark:border-[#243769] pb-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#5645d4] uppercase bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2 py-0.5 rounded">
                {dppPlan.boardId.toUpperCase()} • Class {dppPlan.classGrade} • {dppPlan.subjectId.toUpperCase()}
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a1a1a] dark:text-[#f6f5f4] mt-1.5">
                {currentDay.dayTitle}
              </h2>
            </div>
            <div className="text-right text-xs font-medium text-[#5d5b54] dark:text-[#a4a097] space-y-0.5">
              <div>Time Allowed: <strong className="text-[#1a1a1a] dark:text-[#f6f5f4]">{currentDay.estimatedMinutes} Minutes</strong></div>
              <div>Maximum Marks: <strong className="text-[#1a1a1a] dark:text-[#f6f5f4]">{currentDay.totalMarks} Marks</strong></div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#5d5b54] dark:text-[#a4a097] pt-1">
            <BookOpen className="w-3.5 h-3.5 text-[#5645d4] shrink-0" />
            <span>Target Concept: <strong className="text-[#1a1a1a] dark:text-[#f6f5f4]">{currentDay.focusConcept}</strong></span>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-5">
          {currentDay.questions.map((q) => {
            const isSolutionOpen = showAllSolutions || !!expandedSolutions[q.id];

            return (
              <div 
                key={q.id}
                className="p-4 sm:p-5 rounded-xl border border-[#e5e3df] dark:border-[#243769] bg-[#f6f5f4]/40 dark:bg-[#16254c] space-y-3 transition-colors"
              >
                {/* Question Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#1a1a1a] dark:text-[#f6f5f4]">
                      Q{q.questionNumber}.
                    </span>
                    <span className="font-semibold uppercase tracking-wider text-[10px] bg-white dark:bg-[#0f1c3d] px-2 py-0.5 rounded border border-[#e5e3df] dark:border-[#243769] text-[#5d5b54] dark:text-[#a4a097]">
                      {q.type.replace('_', ' ')}
                    </span>
                    {q.bloomsLevel && (
                      <span className="text-[10px] font-semibold text-[#5645d4] bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2 py-0.5 rounded">
                        {q.bloomsLevel}
                      </span>
                    )}
                    {q.formulaUsed && (
                      <span className="text-[10px] font-mono text-[#2a9d99] bg-[#dcecfa] dark:bg-[#2a9d99]/20 px-2 py-0.5 rounded">
                        {q.formulaUsed}
                      </span>
                    )}
                  </div>

                  <span className="font-bold text-xs text-[#1a1a1a] dark:text-[#f6f5f4] bg-white dark:bg-[#0f1c3d] px-2 py-0.5 rounded border border-[#e5e3df] dark:border-[#243769] shadow-2xs">
                    [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                  </span>
                </div>

                {/* Question Statement */}
                <div className="text-sm font-medium text-[#1a1a1a] dark:text-[#f6f5f4] leading-relaxed whitespace-pre-line">
                  {q.questionText}
                </div>

                {/* MCQ Options if applicable */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div 
                        key={oIdx}
                        className="p-2.5 rounded-lg bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] text-xs text-[#1a1a1a] dark:text-[#f6f5f4] font-medium"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hint if provided */}
                {q.hint && (
                  <div className="text-xs text-[#5d5b54] dark:text-[#a4a097] bg-[#fef7d6] dark:bg-[#243769] border border-[#f9e79f] dark:border-[#243769] p-2.5 rounded-lg flex items-start space-x-2">
                    <HelpCircle className="w-4 h-4 text-[#dd5b00] shrink-0 mt-0.5" />
                    <span><strong>Hint:</strong> {q.hint}</span>
                  </div>
                )}

                {/* Solution Accordion */}
                <div className="pt-2 print:block">
                  <button
                    type="button"
                    onClick={() => toggleSolution(q.id)}
                    className="flex items-center space-x-1 text-xs font-semibold text-[#5645d4] hover:underline print:hidden cursor-pointer"
                  >
                    {isSolutionOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    <span>{isSolutionOpen ? 'Hide Step-by-Step Answer' : 'View Step-by-Step Answer'}</span>
                  </button>

                  {isSolutionOpen && (
                    <div className="mt-2.5 p-3.5 rounded-lg bg-[#d9f3e1]/60 dark:bg-[#1aae39]/10 border border-[#1aae39]/30 space-y-1.5 text-xs">
                      <div className="font-bold text-[#006644] dark:text-[#1aae39] flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Expected Answer Key: {q.correctAnswer}</span>
                      </div>
                      <div className="space-y-1 text-[#1a1a1a] dark:text-[#f6f5f4] leading-relaxed pt-1">
                        <strong className="text-[10px] uppercase tracking-wider text-[#5d5b54] dark:text-[#a4a097] block">
                          Step-by-Step Derivation / Solution:
                        </strong>
                        {q.solutionSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start space-x-1.5">
                            <span className="text-[#1aae39]">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#e5e3df] dark:border-[#243769] text-center text-xs text-[#787671] dark:text-[#a4a097]">
          <span>EduGen AI • Standard Curriculum Grounded Daily Practice Plan • {dppPlan.chapterTitle}</span>
        </div>
      </div>
    </div>
  );
}

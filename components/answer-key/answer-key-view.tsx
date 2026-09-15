'use client';

import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  FileText, 
  CheckSquare, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Save 
} from 'lucide-react';
import { GeneratedAnswerKey } from '../../services/answer-key/types';
import { DocxExporter } from '../../services/export/docx-exporter';
import { useHistoryStore } from '../../store/use-history-store';

interface Props {
  answerKey: GeneratedAnswerKey;
}

export function AnswerKeyView({ answerKey }: Props) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { saveAnswerKey } = useHistoryStore();

  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    await DocxExporter.exportAnswerKey(answerKey);
  };

  const handleSave = () => {
    saveAnswerKey(answerKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="bg-jira-surface dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-4 shadow-jira-card flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs md:text-sm font-bold bg-jira-green-bg dark:bg-emerald-950/60 text-jira-green-text dark:text-emerald-400 px-3 py-1 rounded border border-jira-green/30">
            MARKING SCHEME
          </span>
          <span className="text-sm md:text-base font-bold text-jira-text dark:text-dark-text">{answerKey.paperTitle}</span>
          <span className="text-xs md:text-sm font-semibold text-jira-subtext dark:text-dark-subtext">({answerKey.totalMarks} Marks)</span>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover px-3.5 py-2 rounded-md text-xs md:text-sm font-bold text-jira-text dark:text-dark-text transition-colors shadow-xs"
          >
            <Save className="w-4 h-4 text-jira-subtext dark:text-dark-subtext" />
            <span>{saveSuccess ? 'Saved!' : 'Save Scheme'}</span>
          </button>

          <button
            onClick={handleExportDocx}
            className="flex items-center space-x-1.5 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover px-3.5 py-2 rounded-md text-xs md:text-sm font-bold text-jira-text dark:text-dark-text transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-jira-primary" />
            <span>Export DOCX</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-jira-primary hover:bg-jira-primary-hover text-white px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Answer Key Document */}
      <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg shadow-jira-card p-8 md:p-14 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="text-center border-b-2 border-jira-border dark:border-dark-border pb-5 mb-7">
          <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-jira-green-text dark:text-emerald-400 bg-jira-green-bg dark:bg-emerald-950/60 inline-block px-3.5 py-1.5 rounded-md mb-2.5">
            OFFICIAL MARKING SCHEME & EVALUATION RUBRIC
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-jira-text dark:text-dark-text uppercase">
            {answerKey.schoolName}
          </h1>
          <h2 className="text-base md:text-lg font-bold text-jira-subtext dark:text-dark-subtext mt-1.5">
            {answerKey.paperTitle} • {answerKey.chapterTitle}
          </h2>
          <div className="flex justify-between items-center text-xs md:text-sm font-bold text-jira-subtext dark:text-dark-subtext mt-4 pt-2.5 border-t border-jira-border dark:border-dark-border">
            <span>BOARD: {answerKey.boardName}</span>
            <span>MAXIMUM MARKS: {answerKey.totalMarks}</span>
            <span>DATE: {new Date(answerKey.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Evaluator Guidelines Box */}
        <div className="bg-jira-bg/60 dark:bg-dark-card/60 border border-jira-border dark:border-dark-border p-5 rounded-lg mb-7 text-xs md:text-sm text-jira-text dark:text-dark-text space-y-2">
          <div className="font-bold text-jira-text dark:text-dark-text uppercase tracking-wider mb-1.5 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-jira-green" />
            <span>General Evaluation Guidelines for Teachers:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-jira-subtext dark:text-dark-subtext leading-relaxed">
            {answerKey.evaluatorInstructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
        </div>

        {/* Item by Item Solutions & Rubrics */}
        <div className="space-y-6">
          {answerKey.items.map((item) => (
            <div key={item.id} className="p-5 rounded-lg border border-jira-border dark:border-dark-border bg-white dark:bg-dark-card shadow-xs space-y-3.5">
              {/* Question Bar */}
              <div className="flex items-start justify-between gap-3 border-b border-jira-border/60 dark:border-dark-border/60 pb-2.5">
                <div>
                  <span className="font-bold text-xs md:text-sm text-jira-primary font-mono mr-2.5 bg-jira-selected dark:bg-jira-primary/20 px-2.5 py-1 rounded">
                    Q{item.qNumber}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-jira-text dark:text-dark-text italic">
                    {item.questionText}
                  </span>
                </div>
                <span className="font-bold text-xs md:text-sm bg-jira-bg dark:bg-dark-bg px-2.5 py-1 rounded text-jira-text dark:text-dark-text shrink-0">
                  [{item.marks} M]
                </span>
              </div>

              {/* Correct Key / Value Point */}
              <div className="p-3.5 rounded-md bg-jira-green-bg/50 dark:bg-emerald-950/40 border border-jira-green/30 text-sm">
                <span className="font-bold text-jira-green-text dark:text-emerald-400 uppercase tracking-wider block mb-1 text-xs">
                  {item.correctOptionKey ? `Correct Option: (${item.correctOptionKey})` : 'Expected Value Point / Answer:'}
                </span>
                <span className="font-bold text-jira-text dark:text-dark-text leading-relaxed">
                  {item.finalAnswer}
                </span>
              </div>

              {/* Step by Step Breakdown */}
              <div className="text-sm space-y-2">
                <span className="text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider block">
                  Step-by-Step Solution:
                </span>
                <div className="text-jira-text dark:text-dark-text whitespace-pre-line bg-jira-bg/30 dark:bg-dark-bg/50 p-3.5 rounded-md border border-jira-border dark:border-dark-border leading-relaxed font-sans">
                  {item.stepByStepSolution}
                </div>
              </div>

              {/* Step Marks Rubric Table if available */}
              {item.stepEvaluations && item.stepEvaluations.length > 0 && (
                <div className="border border-jira-border dark:border-dark-border rounded-md overflow-hidden text-xs md:text-sm mt-2">
                  <table className="w-full text-left">
                    <thead className="bg-jira-bg dark:bg-dark-bg text-jira-subtext dark:text-dark-subtext font-bold text-xs uppercase">
                      <tr>
                        <th className="p-2.5 pl-3">Step</th>
                        <th className="p-2.5">Evaluation Rubric</th>
                        <th className="p-2.5 pr-3 text-right w-24">Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-jira-border dark:divide-dark-border">
                      {item.stepEvaluations.map((step, sIdx) => (
                        <tr key={sIdx} className="hover:bg-jira-hover/30 dark:hover:bg-dark-hover/30">
                          <td className="p-2.5 pl-3 font-mono text-jira-muted dark:text-dark-muted">{step.stepNumber}</td>
                          <td className="p-2.5 text-jira-text dark:text-dark-text font-medium">{step.description}</td>
                          <td className="p-2.5 pr-3 text-right font-mono font-bold text-jira-primary">{step.marksAwarded} M</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Common Pitfalls note */}
              {item.commonPitfalls && (
                <div className="flex items-start space-x-2.5 text-xs md:text-sm text-jira-yellow-text dark:text-amber-300 bg-jira-yellow-bg dark:bg-amber-950/40 p-3 rounded-md mt-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Common Student Mistake: </strong>
                    <span>{item.commonPitfalls}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

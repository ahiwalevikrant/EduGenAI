'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Sparkles, 
  ArrowLeft, 
  CheckSquare, 
  Layers, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { useCurriculumStore } from '../../../store/use-curriculum-store';
import { CurriculumSelector } from '../../../components/curriculum/curriculum-selector';
import { PaperConfigurator } from '../../../components/question-paper/paper-configurator';
import { PaperPreviewView } from '../../../components/question-paper/paper-preview';
import { GeneratedQuestionPaper } from '../../../services/question-paper/types';
import { useHistoryStore } from '../../../store/use-history-store';

export default function QuestionPaperPage() {
  const router = useRouter();
  const { selectedChapter } = useCurriculumStore();
  const { savePaper } = useHistoryStore();
  const [generatedPaper, setGeneratedPaper] = useState<GeneratedQuestionPaper | null>(null);

  const handlePaperGenerated = (paper: GeneratedQuestionPaper) => {
    setGeneratedPaper(paper);
    savePaper(paper);
  };

  const handleGenerateAnswerKey = () => {
    if (generatedPaper) {
      router.push(`/generate/answer-key?paperId=${generatedPaper.id}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-jira-border rounded-lg p-5 md:p-6 shadow-jira-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <FileText className="w-6 h-6 text-jira-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-jira-text">
              Board-Aligned Question Paper Generator
            </h1>
          </div>
          <p className="text-xs md:text-sm text-jira-subtext mt-1">
            Generate authentic examination papers with automated marks distribution grounded strictly in official curriculum.
          </p>
        </div>

        {generatedPaper && (
          <button
            onClick={() => setGeneratedPaper(null)}
            className="flex items-center space-x-2 bg-jira-bg hover:bg-jira-hover border border-jira-border text-jira-text px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Re-configure Blueprint</span>
          </button>
        )}
      </div>

      {/* Curriculum Cascading Selector */}
      <CurriculumSelector />

      {/* Generation View or Paper Preview */}
      {!generatedPaper ? (
        <PaperConfigurator onPaperGenerated={handlePaperGenerated} />
      ) : (
        <PaperPreviewView 
          paper={generatedPaper} 
          onGenerateAnswerKey={handleGenerateAnswerKey} 
        />
      )}
    </div>
  );
}

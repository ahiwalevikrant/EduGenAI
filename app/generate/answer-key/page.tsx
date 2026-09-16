'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckSquare, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import Link from 'next/link';
import { useCurriculumStore } from '../../../store/use-curriculum-store';
import { useSettingsStore } from '../../../store/use-settings-store';
import { useHistoryStore } from '../../../store/use-history-store';
import { CurriculumSelector } from '../../../components/curriculum/curriculum-selector';
import { AnswerKeyView } from '../../../components/answer-key/answer-key-view';
import { AnswerKeyGenerator } from '../../../services/answer-key/answer-generator';
import { AIService } from '../../../services/ai/ai-service';
import { GeneratedAnswerKey } from '../../../services/answer-key/types';
import { GeneratedQuestionPaper } from '../../../services/question-paper/types';
import { GenerationLoaderModal } from '../../../components/ui/generation-loader-modal';

function AnswerKeyContent() {
  const searchParams = useSearchParams();
  const paperId = searchParams.get('paperId');

  const { selectedChapter, boardId } = useCurriculumStore();
  const { providers, activeProviderId } = useSettingsStore();
  const { papers, answerKeys, saveAnswerKey } = useHistoryStore();

  const activeProviderConfig = providers.find(p => p.id === activeProviderId) || providers[0];

  const targetPaper: GeneratedQuestionPaper | undefined = paperId 
    ? papers.find(p => p.id === paperId)
    : papers[0];

  const [currentKey, setCurrentKey] = useState<GeneratedAnswerKey | null>(() => {
    if (paperId) {
      const existing = answerKeys.find(k => k.paperId === paperId);
      if (existing) return existing;
    }
    return answerKeys[0] || null;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateKey = async () => {
    if (!targetPaper) {
      setErrorMessage('Please generate a Question Paper first before creating an Answer Key.');
      return;
    }

    if (!selectedChapter) {
      setErrorMessage('Please select a curriculum chapter.');
      return;
    }

    if (!activeProviderConfig?.apiKey?.trim()) {
      setErrorMessage(`Please configure an API Key for ${activeProviderConfig.name} in Settings before generating.`);
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const provider = AIService.createProvider(activeProviderConfig);
      const generated = await AnswerKeyGenerator.generate(targetPaper, selectedChapter, provider);
      setCurrentKey(generated);
      saveAnswerKey(generated);
    } catch (err: any) {
      console.error('Answer Key Generation Error:', err);
      setErrorMessage(err.message || 'Failed to generate answer key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Rich Multi-Step Answer Key Solving Loader Modal */}
      <GenerationLoaderModal
        isOpen={isGenerating}
        title="Generating Official Marking Scheme & Solutions"
        subtitle={`Solving all questions for "${targetPaper?.title}" according to ${boardId.toUpperCase()} board evaluation rubrics.`}
        steps={[
          `Parsing examination questions and point values for ${targetPaper?.title}...`,
          `Formulating step-by-step verified solutions from official textbook context...`,
          `Extracting correct MCQ keys, value points, and algebraic steps...`,
          `Establishing rubric step-marking allocations (formula, substitution, SI units)...`,
          `Compiling common student pitfall warnings for evaluators...`
        ]}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-5 shadow-jira-card flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <CheckSquare className="w-6 h-6 text-jira-green" />
              <h1 className="text-xl md:text-2xl font-bold text-jira-text dark:text-dark-text">
                Answer Key & Evaluator Marking Scheme Generator
              </h1>
            </div>
            <p className="text-sm text-jira-subtext dark:text-dark-subtext mt-1">
              Generate authentic step-by-step solutions, marking criteria, and common student mistake warnings.
            </p>
          </div>

          {targetPaper && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateKey}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-jira-green hover:bg-jira-green/90 disabled:bg-jira-muted text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm cursor-pointer"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGenerating ? 'Solving with AI...' : 'Generate New Marking Scheme'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Curriculum Selector */}
        <CurriculumSelector />

        {errorMessage && (
          <div className="p-4 rounded-lg bg-jira-red-bg dark:bg-red-950/60 border border-jira-red/30 dark:border-red-900 text-jira-red-text dark:text-red-300 text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Error: </span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Main View */}
        {currentKey ? (
          <AnswerKeyView answerKey={currentKey} />
        ) : (
          <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-12 text-center shadow-jira-card space-y-5 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-jira-green-bg dark:bg-emerald-950/60 text-jira-green flex items-center justify-center mx-auto">
              <CheckSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-jira-text dark:text-dark-text">No Marking Scheme Generated Yet</h3>
              <p className="text-sm text-jira-subtext dark:text-dark-subtext max-w-md mx-auto leading-relaxed">
                Generate a board-aligned question paper first, or click below to solve questions for the active paper with step-by-step marking rubrics.
              </p>
            </div>

            {targetPaper ? (
              <button
                onClick={handleGenerateKey}
                disabled={isGenerating}
                className="inline-flex items-center space-x-2 bg-jira-green hover:bg-jira-green/90 text-white font-bold text-sm px-6 py-3 rounded-md transition-colors shadow-sm"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Answer Key for: {targetPaper.title}</span>
              </button>
            ) : (
              <Link
                href="/generate/question-paper"
                className="inline-flex items-center space-x-2 bg-jira-primary hover:bg-jira-primary-hover text-white font-bold text-sm px-6 py-3 rounded-md transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Create Question Paper First →</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function AnswerKeyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-jira-subtext">Loading Answer Key Studio...</div>}>
      <AnswerKeyContent />
    </Suspense>
  );
}

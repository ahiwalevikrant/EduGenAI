'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  AlertCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { useCurriculumStore } from '../../../store/use-curriculum-store';
import { useSettingsStore } from '../../../store/use-settings-store';
import { CurriculumSelector } from '../../../components/curriculum/curriculum-selector';
import { DPPConfigurator } from '../../../components/dpp/dpp-configurator';
import { DPPPreview } from '../../../components/dpp/dpp-preview';
import { GenerationLoaderModal } from '../../../components/ui/generation-loader-modal';
import { DPPConfig, DPPPlan } from '../../../services/dpp/types';
import { DPPGenerator } from '../../../services/dpp/dpp-generator';

const DEFAULT_DPP_CONFIG: DPPConfig = {
  daysCount: 3,
  questionsPerDay: 5,
  difficulty: 'progressive',
  durationMinutesPerDay: 20,
  questionTypes: ['mcq', 'assertion_reason', 'short_answer', 'numerical'],
  includeSolutions: true,
  includeHints: true,
  customInstructions: ''
};

export default function DPPGeneratePage() {
  const { selectedChapter } = useCurriculumStore();
  const { activeProvider } = useSettingsStore();

  const [config, setConfig] = useState<DPPConfig>(DEFAULT_DPP_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<DPPPlan | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleGenerate = async () => {
    if (!selectedChapter) return;

    setIsGenerating(true);
    setCurrentStepIndex(0);

    try {
      const plan = await DPPGenerator.generateDPP(
        selectedChapter,
        config,
        activeProvider,
        (step) => {
          setCurrentStepIndex((prev) => Math.min(4, prev + 1));
        }
      );

      setGeneratedPlan(plan);

    } catch (err: any) {
      console.error('DPP generation failed:', err);
      alert(`Error generating DPP: ${err.message || 'Check your AI API key in Settings.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-5 md:p-6 shadow-jira-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-jira-selected dark:bg-jira-primary/20 text-jira-primary flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-jira-primary bg-jira-selected dark:bg-jira-primary/20 px-2 py-0.5 rounded">
                DPP STUDIO
              </span>
              <span className="text-xs font-semibold text-jira-subtext dark:text-dark-subtext">
                Multi-Day Practice Plans
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-jira-text dark:text-dark-text mt-0.5">
              Daily Practice Plan (DPP) Generator
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {generatedPlan && (
            <button
              onClick={() => setGeneratedPlan(null)}
              className="flex items-center space-x-1.5 bg-jira-bg dark:bg-dark-card hover:bg-jira-hover dark:hover:bg-dark-hover border border-jira-border dark:border-dark-border text-jira-text dark:text-dark-text text-xs md:text-sm font-semibold px-3.5 py-2 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reconfigure Blueprint</span>
            </button>
          )}

          <Link
            href="/curriculum"
            className="flex items-center space-x-1.5 bg-jira-bg dark:bg-dark-card hover:bg-jira-hover dark:hover:bg-dark-hover border border-jira-border dark:border-dark-border text-jira-text dark:text-dark-text text-xs md:text-sm font-semibold px-3.5 py-2 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Curriculum Explorer</span>
          </Link>
        </div>
      </div>

      {/* Curriculum Selector Bar */}
      <CurriculumSelector />

      {/* Main Content Area */}
      {!selectedChapter ? (
        <div className="p-10 text-center bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg text-jira-subtext dark:text-dark-subtext space-y-2 shadow-xs">
          <BookOpen className="w-8 h-8 mx-auto text-jira-primary" />
          <p className="font-bold text-base text-jira-text dark:text-dark-text">No Chapter Selected</p>
          <p className="text-sm">Please select a board, class, subject, and chapter using the dropdowns above to generate a DPP.</p>
        </div>
      ) : generatedPlan ? (
        <DPPPreview dppPlan={generatedPlan} />
      ) : (
        <DPPConfigurator
          chapter={selectedChapter}
          config={config}
          onChange={setConfig}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          activeProvider={activeProvider}
        />
      )}

      {/* Generation Multi-Step Loader Modal */}
      <GenerationLoaderModal
        isOpen={isGenerating}
        title={`Generating ${config.daysCount}-Day Daily Practice Plan`}
        subtitle={`Crafting structured daily micro-practice drills for ${selectedChapter?.title || 'selected chapter'}`}
        currentStepIndex={currentStepIndex}
      />
    </div>
  );
}

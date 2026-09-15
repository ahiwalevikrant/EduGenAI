'use client';

import React, { useState } from 'react';
import { 
  Presentation, 
  Sparkles, 
  Clock, 
  Sliders, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft, 
  Palette, 
  BookOpen,
  Layers
} from 'lucide-react';
import { useCurriculumStore } from '../../../store/use-curriculum-store';
import { useSettingsStore } from '../../../store/use-settings-store';
import { useHistoryStore } from '../../../store/use-history-store';
import { CurriculumSelector } from '../../../components/curriculum/curriculum-selector';
import { CanvaPPTStudio } from '../../../components/ppt/canva-ppt-studio';
import { PPTGenerator, PPTConfig } from '../../../services/ppt/ppt-generator';
import { AIService } from '../../../services/ai/ai-service';
import { PPTDeck, TeachingStyle, SlideThemeId } from '../../../services/ppt/types';
import { GenerationLoaderModal } from '../../../components/ui/generation-loader-modal';

export default function PPTStudioPage() {
  const { selectedChapter, boardId } = useCurriculumStore();
  const { providers, activeProviderId } = useSettingsStore();
  const { pptDecks, savePPTDeck } = useHistoryStore();

  const activeProviderConfig = providers.find(p => p.id === activeProviderId) || providers[0];

  const [activeDeck, setActiveDeck] = useState<PPTDeck | null>(() => pptDecks[0] || null);
  const [slideCount, setSlideCount] = useState<number>(10);
  const [teachingDuration, setTeachingDuration] = useState<number>(45);
  const [teachingStyle, setTeachingStyle] = useState<TeachingStyle>('concept-focused');
  const [themeId, setThemeId] = useState<SlideThemeId>('jira_blue');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateDeck = async () => {
    if (!selectedChapter) {
      setErrorMessage('Please select a curriculum chapter first.');
      return;
    }

    if (!activeProviderConfig?.apiKey?.trim() && activeProviderConfig.type !== 'custom') {
      setErrorMessage(`Please configure an API Key for ${activeProviderConfig.name} in Settings before generating.`);
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const provider = AIService.createProvider(activeProviderConfig);
      const config: PPTConfig = {
        slideCount,
        teachingDuration,
        teachingStyle,
        themeId
      };

      const deck = await PPTGenerator.generate(selectedChapter, config, provider);
      setActiveDeck(deck);
      savePPTDeck(deck);
    } catch (err: any) {
      console.error('PPT Generation error:', err);
      setErrorMessage(err.message || 'Failed to generate presentation deck.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Rich Multi-Step PPT Generation Loader Modal */}
      <GenerationLoaderModal
        isOpen={isGenerating}
        title={`Generating ${slideCount}-Slide Pedagogical Deck`}
        subtitle={`Structuring "${teachingStyle}" presentation for "${selectedChapter?.title}" (${boardId.toUpperCase()}).`}
        steps={[
          `Extracting verified textbook concepts and learning objectives for ${selectedChapter?.title}...`,
          `Structuring ${slideCount} classroom slides with introductory hook, derivations & summaries...`,
          `Generating teacher speaker notes and educational visual diagram prompts...`,
          `Formulating interactive concept checks and board exam tips...`,
          `Assembling Canva-style presentation workspace...`
        ]}
      />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-5 shadow-jira-card flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <Presentation className="w-6 h-6 text-jira-teal" />
              <h1 className="text-xl md:text-2xl font-bold text-jira-text dark:text-dark-text">
                Teaching PPT Studio & Slide Deck Generator
              </h1>
            </div>
            <p className="text-sm text-jira-subtext dark:text-dark-subtext mt-1">
              Generate classroom-ready presentations with learning hooks, derivations, diagrams, and editable PPTX export.
            </p>
          </div>

          {activeDeck && (
            <button
              onClick={() => setActiveDeck(null)}
              className="flex items-center space-x-2 bg-jira-bg dark:bg-dark-card hover:bg-jira-hover dark:hover:bg-dark-hover border border-jira-border dark:border-dark-border text-jira-text dark:text-dark-text px-3.5 py-2 rounded-md text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Generate New Deck</span>
            </button>
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

        {/* Configurator or Slide Studio */}
        {!activeDeck ? (
          <div className="bg-jira-surface dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg shadow-jira-card p-6 md:p-8 space-y-6">
            <div className="border-b border-jira-border dark:border-dark-border pb-4">
              <h2 className="text-lg font-bold text-jira-text dark:text-dark-text">
                Presentation Masterclass Configuration
              </h2>
              <p className="text-sm text-jira-subtext dark:text-dark-subtext mt-1">
                Target chapter: <strong className="text-jira-text dark:text-dark-text">{selectedChapter?.title}</strong> ({selectedChapter?.code})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Slide Count */}
              <div>
                <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
                  Number of Slides
                </label>
                <select
                  value={slideCount}
                  onChange={(e) => setSlideCount(parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark dark:hover:border-dark-border focus:border-jira-primary rounded-md px-3.5 py-2 text-sm font-semibold text-jira-text dark:text-dark-text outline-none cursor-pointer shadow-sm transition-colors"
                >
                  <option value={8} className="bg-white dark:bg-dark-surface">8 Slides (Quick Overview / 30m)</option>
                  <option value={10} className="bg-white dark:bg-dark-surface">10 Slides (Standard Lesson / 45m)</option>
                  <option value={12} className="bg-white dark:bg-dark-surface">12 Slides (Deep Dive / 60m)</option>
                  <option value={15} className="bg-white dark:bg-dark-surface">15 Slides (Comprehensive Masterclass)</option>
                  <option value={20} className="bg-white dark:bg-dark-surface">20 Slides (Full Chapter Exploration)</option>
                </select>
              </div>

              {/* Teaching Duration */}
              <div>
                <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
                  Lesson Duration
                </label>
                <select
                  value={teachingDuration}
                  onChange={(e) => setTeachingDuration(parseInt(e.target.value))}
                  className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark dark:hover:border-dark-border focus:border-jira-primary rounded-md px-3.5 py-2 text-sm font-semibold text-jira-text dark:text-dark-text outline-none cursor-pointer shadow-sm transition-colors"
                >
                  <option value={30} className="bg-white dark:bg-dark-surface">30 Minutes</option>
                  <option value={45} className="bg-white dark:bg-dark-surface">45 Minutes (Standard Period)</option>
                  <option value={60} className="bg-white dark:bg-dark-surface">60 Minutes (Double Period)</option>
                  <option value={90} className="bg-white dark:bg-dark-surface">90 Minutes (Block Period / Workshop)</option>
                </select>
              </div>

              {/* Teaching Style */}
              <div>
                <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
                  Pedagogical Style
                </label>
                <select
                  value={teachingStyle}
                  onChange={(e) => setTeachingStyle(e.target.value as TeachingStyle)}
                  className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark dark:hover:border-dark-border focus:border-jira-primary rounded-md px-3.5 py-2 text-sm font-semibold text-jira-text dark:text-dark-text outline-none cursor-pointer shadow-sm transition-colors"
                >
                  <option value="concept-focused" className="bg-white dark:bg-dark-surface">Concept-Focused (Deep Intuition)</option>
                  <option value="interactive" className="bg-white dark:bg-dark-surface">Interactive (Live Quizzes & Polls)</option>
                  <option value="exam-focused" className="bg-white dark:bg-dark-surface">Exam-Focused (Board Scoring Tips)</option>
                  <option value="visual" className="bg-white dark:bg-dark-surface">Visual (Diagrams & Flowcharts)</option>
                  <option value="revision" className="bg-white dark:bg-dark-surface">Revision (Fast Summary Cheat Sheet)</option>
                </select>
              </div>

              {/* Theme Preset */}
              <div>
                <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
                  Visual Theme
                </label>
                <select
                  value={themeId}
                  onChange={(e) => setThemeId(e.target.value as SlideThemeId)}
                  className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark dark:hover:border-dark-border focus:border-jira-primary rounded-md px-3.5 py-2 text-sm font-semibold text-jira-text dark:text-dark-text outline-none cursor-pointer shadow-sm transition-colors"
                >
                  <option value="jira_blue" className="bg-white dark:bg-dark-surface">Jira Blue Modern</option>
                  <option value="academic_slate" className="bg-white dark:bg-dark-surface">Academic Deep Navy</option>
                  <option value="emerald_modern" className="bg-white dark:bg-dark-surface">Emerald Fresh</option>
                  <option value="minimal_clean" className="bg-white dark:bg-dark-surface">Minimal Crisp White</option>
                  <option value="dark_navy" className="bg-white dark:bg-dark-surface">Dark Slate Stage</option>
                </select>
              </div>
            </div>

            <div className="pt-5 border-t border-jira-border dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-jira-subtext dark:text-dark-subtext">
                Using AI Provider: <strong className="text-jira-text dark:text-dark-text">{activeProviderConfig?.name}</strong>
              </div>

              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating || !selectedChapter}
                className="flex items-center space-x-2 bg-jira-primary hover:bg-jira-primary-hover disabled:bg-jira-muted text-white font-bold text-sm px-6 py-3 rounded-md transition-colors shadow-sm cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Structuring {slideCount} Pedagogical Slides with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate {slideCount}-Slide Teaching Deck</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <CanvaPPTStudio initialDeck={activeDeck} />
        )}
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  Lightbulb, 
  Layers, 
  BookOpen,
  HelpCircle
} from 'lucide-react';
import { useCurriculumStore } from '../../store/use-curriculum-store';
import { useSettingsStore } from '../../store/use-settings-store';
import { ImageService, GeneratedImageResult } from '../../services/images/image-service';
import { DiagramGenerator, EducationalDiagram } from '../../services/images/diagram-generator';
import { GenerationLoaderModal } from '../ui/generation-loader-modal';

export function DiagramGeneratorView() {
  const { selectedChapter, boardId } = useCurriculumStore();
  const { activeProvider } = useSettingsStore();

  const [prompt, setPrompt] = useState(
    selectedChapter 
      ? `Create a clear educational diagram illustrating ${selectedChapter.title} with high contrast labeled components.` 
      : 'Create a simple educational diagram showing distance and displacement.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedImageResult | null>(() => {
    const defaultDiag = DiagramGenerator.getPrebuiltOrGeneratedSVG(
      selectedChapter?.title || 'Motion',
      'Distance and Displacement Vector Analysis'
    );
    return {
      type: 'svg_diagram',
      diagram: defaultDiag,
      prompt: 'Distance and Displacement Vector Analysis'
    };
  });

  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await ImageService.generateVisual({
        prompt,
        topic: selectedChapter?.title || 'Science',
        title: selectedChapter?.title || 'Concept Diagram',
        providerApiKey: activeProvider?.apiKey
      });
      setCurrentResult(result);
    } catch (e) {
      console.error('Error generating diagram:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySvg = () => {
    if (currentResult?.diagram?.svgCode) {
      navigator.clipboard.writeText(currentResult.diagram.svgCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Rich Multi-Step Diagram Generator Loader Modal */}
      <GenerationLoaderModal
        isOpen={isGenerating}
        title="Synthesizing High-Contrast Educational Diagram"
        subtitle={`Generating vector illustration and scientific labels for "${selectedChapter?.title || prompt}".`}
        steps={[
          'Analyzing pedagogical concept & spatial relationships...',
          'Rendering high-contrast SVG vector geometric paths...',
          'Positioning standard scientific component labels and legends...',
          'Formatting figure caption and classroom presentation notes...'
        ]}
      />

      <div className="bg-jira-surface dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg shadow-jira-card overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-jira-border dark:border-dark-border bg-jira-bg/40 dark:bg-dark-card/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-jira-selected dark:bg-jira-primary/20 text-jira-primary flex items-center justify-center font-bold text-sm border border-jira-primary/30 shadow-xs">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-jira-text dark:text-dark-text">
                Educational Diagram & Visual Explanation Studio
              </h2>
              <p className="text-xs md:text-sm text-jira-subtext dark:text-dark-subtext mt-0.5">
                Generate scientifically accurate diagrams, schematic illustrations, and vector models for teaching slides.
              </p>
            </div>
          </div>

          {selectedChapter && (
            <span className="text-xs font-mono font-bold bg-jira-selected dark:bg-jira-primary/20 text-jira-primary px-3 py-1 rounded-md border border-jira-primary/20">
              {selectedChapter.code}
            </span>
          )}
        </div>

        <div className="p-6 md:p-7 space-y-5">
          {/* Prompt Input & Trigger */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider">
              Pedagogical Visual Prompt
            </label>
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Schematic diagram of Ohm's Law circuit with Voltmeter and Ammeter..."
                className="flex-1 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark dark:hover:border-dark-border focus:border-jira-primary rounded-md px-4 py-2.5 text-sm font-medium text-jira-text dark:text-dark-text outline-none shadow-xs transition-colors"
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center space-x-2 bg-jira-primary hover:bg-jira-primary-hover disabled:bg-jira-muted text-white px-5 py-2.5 rounded-md text-sm font-bold transition-colors shadow-sm cursor-pointer shrink-0"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isGenerating ? 'Generating...' : 'Generate Diagram'}</span>
              </button>
            </div>
          </div>

          {/* Diagram Preview Stage */}
          {currentResult && (
            <div className="border border-jira-border dark:border-dark-border rounded-lg bg-jira-bg/30 dark:bg-dark-card/30 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-jira-text dark:text-dark-text">
                  {currentResult.diagram?.title || 'Visual Output'}
                </span>

                <div className="flex items-center space-x-2">
                  {currentResult.diagram && (
                    <button
                      onClick={handleCopySvg}
                      className="flex items-center space-x-1.5 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover px-3 py-1.5 rounded-md text-xs md:text-sm text-jira-text dark:text-dark-text font-bold transition-colors shadow-xs"
                    >
                      {copied ? <Check className="w-4 h-4 text-jira-green" /> : <Copy className="w-4 h-4 text-jira-subtext dark:text-dark-subtext" />}
                      <span>{copied ? 'Copied SVG' : 'Copy SVG'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rendered SVG / Image Container */}
              <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-6 flex items-center justify-center min-h-[320px] shadow-sm">
                {currentResult.type === 'svg_diagram' && currentResult.diagram ? (
                  <div 
                    className="w-full max-w-lg mx-auto"
                    dangerouslySetInnerHTML={{ __html: currentResult.diagram.svgCode }}
                  />
                ) : currentResult.url ? (
                  <img 
                    src={currentResult.url} 
                    alt={currentResult.prompt} 
                    className="max-w-md max-h-[380px] rounded-md object-contain shadow-sm"
                  />
                ) : null}
              </div>

              {/* Caption & Labels */}
              {currentResult.diagram && (
                <div className="p-4 bg-white dark:bg-dark-card rounded-md border border-jira-border dark:border-dark-border text-sm space-y-3">
                  <p className="italic text-jira-text dark:text-dark-text font-semibold">
                    {currentResult.diagram.caption}
                  </p>

                  {currentResult.diagram.labels && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-jira-border dark:border-dark-border">
                      {currentResult.diagram.labels.map((lbl, idx) => (
                        <div key={idx} className="text-xs md:text-sm">
                          <strong className="font-bold text-jira-primary">{lbl.text}: </strong>
                          <span className="text-jira-subtext dark:text-dark-subtext">{lbl.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

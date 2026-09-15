'use client';

import React, { useState } from 'react';
import { 
  Presentation, 
  Download, 
  Plus, 
  Trash2, 
  Copy, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Save, 
  Check, 
  Layers, 
  Palette, 
  Edit3, 
  BookOpen, 
  HelpCircle,
  Lightbulb,
  Maximize2
} from 'lucide-react';
import { PPTDeck, SlideItem, SlideThemeId, SlideType } from '../../services/ppt/types';
import { PPTXExporter } from '../../services/ppt/pptx-exporter';
import { DiagramGenerator } from '../../services/images/diagram-generator';
import { useHistoryStore } from '../../store/use-history-store';

interface Props {
  initialDeck: PPTDeck;
}

const THEME_STYLES: Record<SlideThemeId, { container: string; header: string; accent: string; card: string; text: string }> = {
  jira_blue: {
    container: 'bg-[#F4F5F7] text-[#172B4D]',
    header: 'text-[#0052CC]',
    accent: 'bg-[#0052CC] text-white',
    card: 'bg-white border-[#DFE1E6]',
    text: 'text-[#172B4D]'
  },
  academic_slate: {
    container: 'bg-[#091E42] text-white',
    header: 'text-[#4C9AFF]',
    accent: 'bg-[#00B8D9] text-[#091E42]',
    card: 'bg-[#172B4D] border-[#253858]',
    text: 'text-slate-100'
  },
  emerald_modern: {
    container: 'bg-[#F4FDF9] text-[#091E42]',
    header: 'text-[#006644]',
    accent: 'bg-[#36B37E] text-white',
    card: 'bg-white border-[#ABF5D1]',
    text: 'text-[#172B4D]'
  },
  minimal_clean: {
    container: 'bg-white text-[#172B4D]',
    header: 'text-[#091E42]',
    accent: 'bg-[#5E6C84] text-white',
    card: 'bg-[#F4F5F7] border-[#DFE1E6]',
    text: 'text-[#172B4D]'
  },
  dark_navy: {
    container: 'bg-[#071426] text-white',
    header: 'text-[#6554C0]',
    accent: 'bg-[#FFAB00] text-[#172B4D]',
    card: 'bg-[#0E223D] border-[#1C3A63]',
    text: 'text-slate-200'
  }
};

export function CanvaPPTStudio({ initialDeck }: Props) {
  const [deck, setDeck] = useState<PPTDeck>(initialDeck);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const { savePPTDeck } = useHistoryStore();

  const currentSlide = deck.slides[activeSlideIndex] || deck.slides[0];
  const theme = THEME_STYLES[deck.themeId] || THEME_STYLES.jira_blue;

  const handleExportPPTX = async () => {
    setIsExporting(true);
    try {
      await PPTXExporter.exportToPPTX(deck);
    } catch (err) {
      console.error('PPTX Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveDeck = () => {
    savePPTDeck(deck);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const updateCurrentSlide = (updates: Partial<SlideItem>) => {
    setDeck(prev => {
      const nextSlides = [...prev.slides];
      nextSlides[activeSlideIndex] = { ...nextSlides[activeSlideIndex], ...updates };
      return { ...prev, slides: nextSlides };
    });
  };

  const addSlide = () => {
    const newSlide: SlideItem = {
      id: `slide-${Date.now()}`,
      slideNumber: deck.slides.length + 1,
      type: 'concept',
      title: 'New Key Concept',
      subtitle: 'Classroom discussion',
      bulletPoints: [
        'Main pedagogical takeaway',
        'Practical real-world application',
        'Important board exam highlight'
      ],
      speakerNotes: 'Explain the core intuition to students.',
      visualSuggestion: 'Diagram representing the new concept.'
    };
    setDeck(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide]
    }));
    setActiveSlideIndex(deck.slides.length);
  };

  const duplicateSlide = () => {
    const copy: SlideItem = {
      ...currentSlide,
      id: `slide-${Date.now()}`,
      slideNumber: deck.slides.length + 1,
      title: `${currentSlide.title} (Copy)`
    };
    setDeck(prev => ({
      ...prev,
      slides: [...prev.slides, copy]
    }));
    setActiveSlideIndex(deck.slides.length);
  };

  const deleteSlide = (index: number) => {
    if (deck.slides.length <= 1) return;
    setDeck(prev => {
      const nextSlides = prev.slides.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
      return { ...prev, slides: nextSlides };
    });
    if (activeSlideIndex >= deck.slides.length - 1) {
      setActiveSlideIndex(Math.max(0, deck.slides.length - 2));
    }
  };

  const handleGenerateDiagramForCurrentSlide = () => {
    const diagram = DiagramGenerator.getPrebuiltOrGeneratedSVG(deck.chapterTitle, currentSlide.title);
    updateCurrentSlide({
      visualSuggestion: diagram.caption,
      keyFormula: currentSlide.keyFormula || (diagram.topic === 'Motion' ? 'v = u + at | s = ut + ½at²' : undefined)
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] bg-jira-bg dark:bg-dark-bg border border-jira-border dark:border-dark-border rounded-lg shadow-jira-card overflow-hidden">
      {/* Top Toolbar (Canva / Jira App Bar Style) */}
      <div className="h-14 bg-white dark:bg-dark-surface border-b border-jira-border dark:border-dark-border px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Presentation className="w-5 h-5 text-jira-teal" />
            <span className="font-bold text-sm text-jira-text dark:text-dark-text truncate max-w-sm">
              {deck.title}
            </span>
          </div>
          <span className="text-xs font-semibold text-jira-muted dark:text-dark-muted font-mono bg-jira-bg dark:bg-dark-card px-2 py-0.5 rounded border border-jira-border dark:border-dark-border">
            {deck.slides.length} Slides • {deck.teachingStyle}
          </span>
        </div>

        {/* Theme Selector & Actions */}
        <div className="flex items-center space-x-2.5">
          {/* Theme Switcher */}
          <div className="flex items-center space-x-2 bg-jira-bg dark:bg-dark-card border border-jira-border dark:border-dark-border px-3 py-1.5 rounded-md text-xs md:text-sm">
            <Palette className="w-4 h-4 text-jira-subtext dark:text-dark-subtext" />
            <select
              value={deck.themeId}
              onChange={(e) => setDeck(prev => ({ ...prev, themeId: e.target.value as SlideThemeId }))}
              className="bg-transparent font-bold text-jira-text dark:text-dark-text outline-none cursor-pointer"
            >
              <option value="jira_blue" className="bg-white dark:bg-dark-surface text-jira-text dark:text-dark-text">Jira Blue</option>
              <option value="academic_slate" className="bg-white dark:bg-dark-surface text-jira-text dark:text-dark-text">Academic Navy</option>
              <option value="emerald_modern" className="bg-white dark:bg-dark-surface text-jira-text dark:text-dark-text">Emerald Fresh</option>
              <option value="minimal_clean" className="bg-white dark:bg-dark-surface text-jira-text dark:text-dark-text">Minimal Clean</option>
              <option value="dark_navy" className="bg-white dark:bg-dark-surface text-jira-text dark:text-dark-text">Dark Slate</option>
            </select>
          </div>

          <button
            onClick={handleSaveDeck}
            className="flex items-center space-x-1.5 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover px-3.5 py-1.5 rounded-md text-xs md:text-sm font-bold text-jira-text dark:text-dark-text transition-colors shadow-xs"
          >
            <Save className="w-4 h-4 text-jira-subtext dark:text-dark-subtext" />
            <span>{saveSuccess ? 'Saved!' : 'Save Deck'}</span>
          </button>

          <button
            onClick={handleExportPPTX}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-jira-primary hover:bg-jira-primary-hover disabled:bg-jira-muted text-white px-4 py-1.5 rounded-md text-xs md:text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting PPTX...' : 'Download PPTX'}</span>
          </button>
        </div>
      </div>

      {/* Main 3-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL 1: LEFT SLIDE THUMBNAILS STRIP */}
        <div className="w-60 bg-jira-sidebar dark:bg-dark-surface border-r border-jira-border dark:border-dark-border flex flex-col justify-between shrink-0 overflow-hidden">
          <div className="p-3 border-b border-jira-border dark:border-dark-border flex items-center justify-between">
            <span className="text-xs font-bold text-jira-muted dark:text-dark-muted uppercase tracking-wider">
              Slides ({deck.slides.length})
            </span>
            <button
              onClick={addSlide}
              className="p-1 hover:bg-jira-hover dark:hover:bg-dark-hover rounded text-jira-primary font-bold text-xs flex items-center space-x-1"
              title="Add Slide"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Slide List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {deck.slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => setActiveSlideIndex(idx)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  idx === activeSlideIndex
                    ? 'bg-white dark:bg-dark-card border-jira-primary ring-2 ring-jira-primary/20 shadow-sm'
                    : 'bg-white/60 dark:bg-dark-card/60 border-jira-border dark:border-dark-border hover:bg-white dark:hover:bg-dark-card hover:border-jira-border-dark dark:hover:border-dark-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-jira-subtext dark:text-dark-subtext">
                    Slide {idx + 1}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-jira-bg dark:bg-dark-bg text-jira-muted dark:text-dark-muted uppercase font-bold">
                    {s.type}
                  </span>
                </div>
                <div className="text-xs md:text-sm font-bold text-jira-text dark:text-dark-text truncate">
                  {s.title}
                </div>
                <div className="text-xs text-jira-muted dark:text-dark-muted truncate mt-0.5">
                  {s.bulletPoints[0] || 'No content'}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Thumbnail Action Toolbar */}
          <div className="p-2.5 border-t border-jira-border dark:border-dark-border bg-white dark:bg-dark-surface flex items-center justify-between text-xs">
            <button
              onClick={duplicateSlide}
              className="p-1.5 hover:bg-jira-hover dark:hover:bg-dark-hover rounded text-jira-subtext dark:text-dark-subtext hover:text-jira-text dark:hover:text-dark-text flex items-center space-x-1 font-bold"
              title="Duplicate current slide"
            >
              <Copy className="w-4 h-4" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => deleteSlide(activeSlideIndex)}
              disabled={deck.slides.length <= 1}
              className="p-1.5 hover:bg-jira-hover dark:hover:bg-dark-hover rounded text-jira-muted dark:text-dark-muted hover:text-jira-red disabled:opacity-30"
              title="Delete slide"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PANEL 2: CENTER SLIDE WYSIWYG CANVAS */}
        <div className="flex-1 bg-jira-bg dark:bg-dark-bg p-6 md:p-8 flex flex-col items-center justify-center overflow-y-auto">
          {/* 16:9 Aspect Ratio Slide Canvas Container */}
          <div className={`w-full max-w-3xl aspect-[16/9] ${theme.container} rounded-xl shadow-jira-modal border border-jira-border p-8 md:p-10 flex flex-col justify-between relative overflow-hidden transition-all`}>
            {/* Top Accent Stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-jira-primary" />

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                  {deck.boardName} • Class {deck.classGrade} {deck.subjectName} | Slide {activeSlideIndex + 1}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded font-mono font-bold bg-black/10">
                  {deck.chapterCode}
                </span>
              </div>

              {/* Editable Slide Title */}
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                className={`w-full text-2xl md:text-3xl font-black bg-transparent border-b border-transparent hover:border-black/20 focus:border-jira-primary outline-none ${theme.header} transition-colors`}
              />

              {/* Editable Subtitle */}
              {currentSlide.subtitle !== undefined && (
                <input
                  type="text"
                  value={currentSlide.subtitle}
                  onChange={(e) => updateCurrentSlide({ subtitle: e.target.value })}
                  className="w-full text-sm italic bg-transparent border-b border-transparent hover:border-black/20 focus:border-jira-primary outline-none opacity-85 mt-1"
                  placeholder="Slide subtitle or pedagogical objective..."
                />
              )}
            </div>

            {/* Slide Body: Bullets and Visual / Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3 flex-1 items-center">
              {/* Left: Bullet Points */}
              <div className="space-y-2.5">
                {currentSlide.bulletPoints.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start space-x-2.5">
                    <span className="text-jira-primary font-black mt-1 text-base">•</span>
                    <textarea
                      value={bullet}
                      onChange={(e) => {
                        const newBullets = [...currentSlide.bulletPoints];
                        newBullets[bIdx] = e.target.value;
                        updateCurrentSlide({ bulletPoints: newBullets });
                      }}
                      className={`w-full bg-transparent text-sm leading-relaxed border border-transparent hover:border-black/15 focus:border-jira-primary p-1.5 rounded-md outline-none resize-none ${theme.text}`}
                      rows={2}
                    />
                  </div>
                ))}

                {/* Key Formula Box if present */}
                {currentSlide.keyFormula && (
                  <div className={`p-3 rounded-md ${theme.card} border text-sm mt-2`}>
                    <span className="text-xs font-bold uppercase tracking-wider block opacity-75 mb-1">
                      Key Equation:
                    </span>
                    <input
                      type="text"
                      value={currentSlide.keyFormula}
                      onChange={(e) => updateCurrentSlide({ keyFormula: e.target.value })}
                      className="w-full font-mono font-bold text-sm bg-transparent outline-none text-jira-primary"
                    />
                  </div>
                )}
              </div>

              {/* Right: Diagram or Visual Illustration */}
              <div className={`h-full min-h-[180px] rounded-lg ${theme.card} border p-4 flex flex-col justify-between`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-jira-primary flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4" />
                    <span>Visual / Diagram Note</span>
                  </span>
                  <button
                    onClick={handleGenerateDiagramForCurrentSlide}
                    className="text-xs text-jira-primary hover:underline font-bold flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Insert Diagram</span>
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center p-2 text-center text-sm italic opacity-90 leading-relaxed">
                  {currentSlide.visualSuggestion || 'Visual diagram suggestion for conceptual explanation.'}
                </div>

                <div className="text-xs text-jira-muted pt-2 border-t border-black/10 flex justify-between font-medium">
                  <span>Classroom Projected Mode</span>
                  <span>16:9 HD</span>
                </div>
              </div>
            </div>

            {/* Bottom Slide Footer */}
            <div className="flex justify-between items-center text-xs opacity-75 pt-2.5 border-t border-black/10">
              <span className="font-semibold">{deck.chapterTitle} • EduGen AI Masterclass</span>
              <span className="font-mono font-bold">Slide {activeSlideIndex + 1} of {deck.slides.length}</span>
            </div>
          </div>

          {/* Quick Slide Navigation Bar */}
          <div className="flex items-center space-x-4 mt-5 text-sm font-bold text-jira-text dark:text-dark-text">
            <button
              onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              disabled={activeSlideIndex === 0}
              className="p-2 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover disabled:opacity-30 rounded-md shadow-xs transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span>
              Slide {activeSlideIndex + 1} of {deck.slides.length}
            </span>
            <button
              onClick={() => setActiveSlideIndex(Math.min(deck.slides.length - 1, activeSlideIndex + 1))}
              disabled={activeSlideIndex === deck.slides.length - 1}
              className="p-2 bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover disabled:opacity-30 rounded-md shadow-xs transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PANEL 3: RIGHT PROPERTIES & SPEAKER NOTES INSPECTOR */}
        <div className="w-80 bg-white dark:bg-dark-surface border-l border-jira-border dark:border-dark-border flex flex-col shrink-0 overflow-y-auto p-5 space-y-5">
          <div>
            <span className="text-xs font-bold text-jira-muted dark:text-dark-muted uppercase tracking-wider block mb-1">
              Slide Configuration
            </span>
            <h3 className="text-sm font-bold text-jira-text dark:text-dark-text">Properties & Notes</h3>
          </div>

          {/* Slide Type */}
          <div>
            <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
              Slide Category
            </label>
            <select
              value={currentSlide.type}
              onChange={(e) => updateCurrentSlide({ type: e.target.value as SlideType })}
              className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border rounded-md px-3 py-2 text-sm font-semibold text-jira-text dark:text-dark-text outline-none focus:border-jira-primary shadow-xs"
            >
              <option value="title" className="bg-white dark:bg-dark-surface">Title & Overview</option>
              <option value="objectives" className="bg-white dark:bg-dark-surface">Learning Objectives</option>
              <option value="concept" className="bg-white dark:bg-dark-surface">Core Concept Explanation</option>
              <option value="diagram_visual" className="bg-white dark:bg-dark-surface">Diagram & Visual Focus</option>
              <option value="activity" className="bg-white dark:bg-dark-surface">NCERT Lab / Activity</option>
              <option value="interactive_quiz" className="bg-white dark:bg-dark-surface">Interactive Concept Quiz</option>
              <option value="exam_tips" className="bg-white dark:bg-dark-surface">Board Exam Scoring Tips</option>
              <option value="summary" className="bg-white dark:bg-dark-surface">Summary & Homework</option>
            </select>
          </div>

          {/* Speaker Notes */}
          <div>
            <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
              Teacher Speaker Notes
            </label>
            <textarea
              value={currentSlide.speakerNotes}
              onChange={(e) => updateCurrentSlide({ speakerNotes: e.target.value })}
              className="w-full bg-jira-bg/50 dark:bg-dark-card border border-jira-border dark:border-dark-border rounded-md p-3 text-sm text-jira-text dark:text-dark-text leading-relaxed outline-none focus:border-jira-primary focus:bg-white dark:focus:bg-dark-card shadow-xs"
              rows={4}
              placeholder="Notes and pedagogical cues to speak during class presentation..."
            />
          </div>

          {/* Visual / Image Prompt */}
          <div>
            <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
              Visual Illustration Prompt
            </label>
            <textarea
              value={currentSlide.imagePrompt || currentSlide.visualSuggestion || ''}
              onChange={(e) => updateCurrentSlide({ imagePrompt: e.target.value })}
              className="w-full bg-jira-bg/50 dark:bg-dark-card border border-jira-border dark:border-dark-border rounded-md p-3 text-sm text-jira-text dark:text-dark-text leading-relaxed outline-none focus:border-jira-primary focus:bg-white dark:focus:bg-dark-card shadow-xs"
              rows={3}
              placeholder="Prompt for generating diagrams or visual aids..."
            />
            <button
              onClick={handleGenerateDiagramForCurrentSlide}
              className="w-full mt-2.5 flex items-center justify-center space-x-2 bg-jira-bg dark:bg-dark-card hover:bg-jira-hover dark:hover:bg-dark-hover border border-jira-border dark:border-dark-border text-jira-primary text-xs md:text-sm font-bold py-2 rounded-md transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Educational Diagram</span>
            </button>
          </div>

          {/* Add Bullet Point button */}
          <button
            onClick={() => {
              updateCurrentSlide({
                bulletPoints: [...currentSlide.bulletPoints, 'New key takeaway point']
              });
            }}
            className="w-full flex items-center justify-center space-x-1.5 bg-jira-selected dark:bg-dark-card border border-jira-primary/30 text-jira-primary hover:bg-jira-selected/80 dark:hover:bg-dark-hover text-xs md:text-sm font-bold py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bullet Point</span>
          </button>
        </div>
      </div>
    </div>
  );
}

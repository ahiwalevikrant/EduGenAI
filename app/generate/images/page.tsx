'use client';

import React from 'react';
import { Image as ImageIcon, Sparkles, Layers, BookOpen } from 'lucide-react';
import { CurriculumSelector } from '../../../components/curriculum/curriculum-selector';
import { DiagramGeneratorView } from '../../../components/images/diagram-generator-view';

export default function DiagramStudioPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-5 md:p-6 shadow-jira-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <ImageIcon className="w-6 h-6 text-jira-purple" />
            <h1 className="text-xl md:text-2xl font-bold text-jira-text dark:text-dark-text">
              Educational Diagram & Illustration Studio
            </h1>
          </div>
          <p className="text-xs md:text-sm text-jira-subtext dark:text-dark-subtext mt-1">
            Generate clean, board-accurate vector diagrams and visual concept representations for textbook lessons.
          </p>
        </div>
      </div>

      {/* Curriculum Selector */}
      <CurriculumSelector />

      {/* Diagram Studio Stage */}
      <DiagramGeneratorView />
    </div>
  );
}

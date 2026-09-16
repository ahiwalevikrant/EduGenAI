'use client';

import React from 'react';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  Layers, 
  BrainCircuit,
  FileCheck
} from 'lucide-react';
import { DPPConfig, DPPDifficulty, DPPQuestionType } from '../../services/dpp/types';
import { Chapter } from '../../services/curriculum/types';
import { AIProviderConfig } from '../../services/ai/ai-provider.interface';

interface Props {
  chapter: Chapter;
  config: DPPConfig;
  onChange: (config: DPPConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  activeProvider?: AIProviderConfig;
}

const QUESTION_TYPES: { type: DPPQuestionType; label: string; desc: string }[] = [
  { type: 'mcq', label: 'Multiple Choice (MCQ)', desc: '4 options with single correct key' },
  { type: 'assertion_reason', label: 'Assertion & Reason', desc: 'Board-standard logic statements' },
  { type: 'short_answer', label: 'Short Conceptual Answer', desc: '2-mark definition and reasoning' },
  { type: 'numerical', label: 'Numerical / Calculations', desc: 'Formula-based problem solving' },
  { type: 'hots', label: 'HOTS (High Order Thinking)', desc: 'Application and analysis problems' }
];

export function DPPConfigurator({
  chapter,
  config,
  onChange,
  onGenerate,
  isGenerating,
  activeProvider
}: Props) {
  const toggleQuestionType = (t: DPPQuestionType) => {
    const exists = config.questionTypes.includes(t);
    if (exists && config.questionTypes.length === 1) return;
    const next = exists 
      ? config.questionTypes.filter(item => item !== t)
      : [...config.questionTypes, t];
    onChange({ ...config, questionTypes: next });
  };

  return (
    <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#e5e3df] dark:border-[#243769] bg-[#f6f5f4]/60 dark:bg-[#16254c]/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#5645d4]" />
          <h3 className="text-xs sm:text-sm font-bold text-[#1a1a1a] dark:text-[#f6f5f4] uppercase tracking-wider">
            Daily Practice Plan (DPP) Blueprint Configuration
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#5d5b54] dark:text-[#a4a097]">
          <span>AI Engine:</span>
          <span className="font-bold text-[#5645d4] bg-[#e6e0f5] dark:bg-[#5645d4]/20 px-2.5 py-0.5 rounded">
            {activeProvider?.name?.split(' ')[0] || 'Groq / OpenRouter'}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* 1. Plan Span & Questions Per Day */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Days Count */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-2">
              1. Practice Days Span
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ ...config, daysCount: d })}
                  className={`py-2 rounded-md text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                    config.daysCount === d
                      ? 'bg-[#5645d4] text-white border-[#5645d4] shadow-2xs'
                      : 'bg-white dark:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4] border-[#c8c4be] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a]'
                  }`}
                >
                  {d} {d === 1 ? 'Day' : 'Days'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#787671] dark:text-[#a4a097] mt-1.5">
              Generates individual daily micro-practice worksheets.
            </p>
          </div>

          {/* Questions Per Day */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-2">
              2. Questions per Day
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[5, 10, 15, 20].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onChange({ ...config, questionsPerDay: q })}
                  className={`py-2 rounded-md text-xs sm:text-sm font-semibold transition-all border cursor-pointer ${
                    config.questionsPerDay === q
                      ? 'bg-[#5645d4] text-white border-[#5645d4] shadow-2xs'
                      : 'bg-white dark:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4] border-[#c8c4be] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a]'
                  }`}
                >
                  {q} Qs
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#787671] dark:text-[#a4a097] mt-1.5">
              Total Questions: <span className="font-bold text-[#5645d4]">{config.daysCount * config.questionsPerDay} questions</span>
            </p>
          </div>

          {/* Daily Session Duration */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-2">
              3. Target Session Duration
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[15, 30, 45].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onChange({ ...config, durationMinutesPerDay: mins })}
                  className={`py-2 rounded-md text-xs sm:text-sm font-semibold transition-all border flex items-center justify-center space-x-1 cursor-pointer ${
                    config.durationMinutesPerDay === mins
                      ? 'bg-[#5645d4] text-white border-[#5645d4] shadow-2xs'
                      : 'bg-white dark:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4] border-[#c8c4be] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a]'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{mins}m</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#787671] dark:text-[#a4a097] mt-1.5">
              Targeted completion time per daily practice session.
            </p>
          </div>
        </div>

        {/* 2. Question Types Inclusion */}
        <div>
          <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-2.5">
            4. Included Problem Types
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUESTION_TYPES.map((qt) => {
              const selected = config.questionTypes.includes(qt.type);
              return (
                <div
                  key={qt.type}
                  onClick={() => toggleQuestionType(qt.type)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                    selected
                      ? 'bg-[#e6e0f5]/30 dark:bg-[#5645d4]/15 border-[#5645d4]'
                      : 'bg-white dark:bg-[#16254c] border-[#e5e3df] dark:border-[#243769] hover:border-[#c8c4be]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                    selected ? 'bg-[#5645d4] border-[#5645d4] text-white' : 'border-[#c8c4be] dark:border-[#243769]'
                  }`}>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] dark:text-[#f6f5f4]">{qt.label}</h4>
                    <p className="text-[11px] text-[#5d5b54] dark:text-[#a4a097] mt-0.5">{qt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Difficulty Level & Special Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-[#e5e3df] dark:border-[#243769]">
          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-2">
              5. Cognitive Difficulty Gradient
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['foundation', 'moderate', 'advanced', 'progressive'] as DPPDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onChange({ ...config, difficulty: diff })}
                  className={`py-2 rounded-md text-xs font-semibold capitalize transition-all border cursor-pointer ${
                    config.difficulty === diff
                      ? 'bg-[#5645d4] text-white border-[#5645d4] shadow-2xs'
                      : 'bg-white dark:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4] border-[#c8c4be] dark:border-[#243769] hover:bg-[#f6f5f4] dark:hover:bg-[#1d2e5a]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#787671] dark:text-[#a4a097] mt-1.5">
              {config.difficulty === 'progressive' ? 'Gradual progression from foundational to HOTS questions.' : `${config.difficulty} difficulty standard.`}
            </p>
          </div>

          {/* Options: Include Solutions & Hints */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-2">
              6. Pedagogical Features
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-medium text-[#1a1a1a] dark:text-[#f6f5f4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeSolutions}
                  onChange={(e) => onChange({ ...config, includeSolutions: e.target.checked })}
                  className="rounded border-[#c8c4be] accent-[#5645d4] w-4 h-4 cursor-pointer"
                />
                <span>Generate verified step-by-step solutions for every problem</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-medium text-[#1a1a1a] dark:text-[#f6f5f4] cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.includeHints}
                  onChange={(e) => onChange({ ...config, includeHints: e.target.checked })}
                  className="rounded border-[#c8c4be] accent-[#5645d4] w-4 h-4 cursor-pointer"
                />
                <span>Include formula hints and concept nudges for self-practice</span>
              </label>
            </div>
          </div>
        </div>

        {/* Generate Action Bar */}
        <div className="pt-4 border-t border-[#e5e3df] dark:border-[#243769] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[#5d5b54] dark:text-[#a4a097]">
            Targeting: <strong className="text-[#1a1a1a] dark:text-[#f6f5f4]">{chapter.title}</strong> ({chapter.code})
          </div>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-[#5645d4] hover:bg-[#4534b3] disabled:opacity-50 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate {config.daysCount}-Day Practice Plan ({config.daysCount * config.questionsPerDay} Qs)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

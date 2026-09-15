'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, RefreshCw, Cpu, Layers, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  steps?: string[];
  currentStepIndex?: number;
}

const DEFAULT_STEPS = [
  'Retrieving verified official textbook & syllabus context...',
  'Extracting core concepts, formulas, and learning outcomes...',
  'Aligning with board assessment blueprints & difficulty distribution...',
  'Generating structured pedagogical content with AI engine...',
  'Validating schema, calculating marks, and formatting output...'
];

export function GenerationLoaderModal({
  isOpen,
  title,
  subtitle = 'EduGen AI is crafting classroom-ready materials grounded in official curriculum.',
  steps = DEFAULT_STEPS,
  currentStepIndex: controlledStepIndex
}: Props) {
  const [internalStepIndex, setInternalStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setInternalStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setInternalStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2400);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  const activeStep = controlledStepIndex !== undefined ? controlledStepIndex : internalStepIndex;
  const progressPercent = Math.min(100, Math.round(((activeStep + 1) / steps.length) * 100));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f1c3d] border-2 border-[#5645d4]/40 dark:border-[#5645d4]/60 rounded-2xl shadow-2xl w-full max-w-lg my-auto p-6 sm:p-8 space-y-6 relative overflow-hidden max-h-[92vh] flex flex-col justify-between transition-all animate-in zoom-in-95 duration-200">
        
        {/* Glowing Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#e5e3df] dark:bg-[#16254c]">
          <div 
            className="h-full bg-[#5645d4] transition-all duration-500 ease-out shadow-[0_0_12px_#5645d4]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Highly Visible Animated Dual-Ring Spinner Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-[#5645d4]/20 border-t-[#5645d4] animate-spin" />
            
            {/* Inner reverse spinning ring */}
            <div 
              className="absolute inset-2 rounded-full border-3 border-[#2a9d99]/20 border-b-[#2a9d99] animate-spin" 
              style={{ animationDirection: 'reverse', animationDuration: '1.8s' }} 
            />
            
            {/* Center glowing badge */}
            <div className="relative w-11 h-11 rounded-full bg-[#5645d4] text-white flex items-center justify-center shadow-lg shadow-[#5645d4]/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] dark:text-[#f6f5f4] tracking-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5d5b54] dark:text-[#a4a097] mt-1 leading-relaxed max-w-md mx-auto">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Progress Percent Bar */}
        <div className="space-y-1.5 bg-[#f6f5f4] dark:bg-[#16254c] p-3 rounded-lg border border-[#e5e3df] dark:border-[#243769]">
          <div className="flex justify-between text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider">
            <span className="flex items-center space-x-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#5645d4] animate-spin" />
              <span>Synthesizing Pedagogical Schema</span>
            </span>
            <span className="text-[#5645d4] dark:text-[#d6b6f6] font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#e5e3df] dark:bg-[#0a1530] h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#5645d4] via-[#7b3ff2] to-[#2a9d99] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Progress Pipeline */}
        <div className="space-y-2 bg-[#f6f5f4]/80 dark:bg-[#16254c]/60 border border-[#e5e3df] dark:border-[#243769] rounded-lg p-3.5 text-xs sm:text-sm overflow-y-auto max-h-44">
          {steps.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isPending = idx > activeStep;

            return (
              <div 
                key={idx}
                className={`flex items-start space-x-3 transition-all duration-200 ${
                  isCurrent 
                    ? 'text-[#1a1a1a] dark:text-white font-semibold' 
                    : isDone 
                    ? 'text-[#5d5b54] dark:text-[#a4a097]' 
                    : 'text-[#bbb8b1] dark:text-[#787671] opacity-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#1aae39]" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#5645d4] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#c8c4be] dark:border-[#787671] flex items-center justify-center text-[9px] font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <span className="leading-tight text-xs">{step}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-[#787671] dark:text-[#a4a097] flex items-center justify-center space-x-1.5 pt-1 border-t border-[#e5e3df] dark:border-[#243769]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#1aae39] shrink-0" />
          <span>Strict official curriculum grounding active • Please do not refresh</span>
        </div>
      </div>
    </div>
  );
}

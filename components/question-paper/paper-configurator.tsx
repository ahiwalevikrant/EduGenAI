'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Clock, 
  Award, 
  Sliders, 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Cpu, 
  RefreshCw, 
  School
} from 'lucide-react';
import Link from 'next/link';
import { useCurriculumStore } from '../../store/use-curriculum-store';
import { useSettingsStore } from '../../store/use-settings-store';
import { AIService } from '../../services/ai/ai-service';
import { QuestionPaperGenerator } from '../../services/question-paper/paper-generator';
import { QuestionPaperBlueprint, DifficultyLevel, QuestionType, GeneratedQuestionPaper } from '../../services/question-paper/types';
import { GenerationLoaderModal } from '../ui/generation-loader-modal';

interface Props {
  onPaperGenerated: (paper: GeneratedQuestionPaper) => void;
}

export function PaperConfigurator({ onPaperGenerated }: Props) {
  const { selectedChapter, boardId, academicYear, classGrade, subjectId } = useCurriculumStore();
  const { providers, activeProviderId } = useSettingsStore();
  const activeProviderConfig = providers.find(p => p.id === activeProviderId) || providers[0];

  const [schoolName, setSchoolName] = useState('DELHI PUBLIC SCHOOL / KENDRIYA VIDYALAYA');
  const [paperTitle, setPaperTitle] = useState('Periodic Assessment Examination');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Section Blueprint Configuration
  const [sections, setSections] = useState<{
    name: string;
    description: string;
    questionType: QuestionType;
    questionCount: number;
    marksPerQuestion: number;
  }[]>([
    { name: 'SECTION A - Objective & MCQs', description: 'Multiple Choice Questions & Assertion-Reason', questionType: 'mcq', questionCount: 5, marksPerQuestion: 1 },
    { name: 'SECTION B - Very Short Answer', description: 'Conceptual 1-2 sentence answers', questionType: 'very_short', questionCount: 3, marksPerQuestion: 2 },
    { name: 'SECTION C - Short Answer', description: 'Short answers & derivations', questionType: 'short_answer', questionCount: 3, marksPerQuestion: 3 },
    { name: 'SECTION D - Long Answer', description: 'Comprehensive descriptive questions', questionType: 'long_answer', questionCount: 2, marksPerQuestion: 5 },
    { name: 'SECTION E - Case-Based / Competency', description: 'Source passage followed by sub-questions', questionType: 'case_based', questionCount: 1, marksPerQuestion: 4 }
  ]);

  // Auto-calculated total marks
  const totalCalculatedMarks = sections.reduce((sum, s) => sum + (s.questionCount * s.marksPerQuestion), 0);

  const updateSection = (index: number, key: string, value: any) => {
    setSections(prev => prev.map((s, idx) => idx === index ? { ...s, [key]: value } : s));
  };

  const removeSection = (index: number) => {
    if (sections.length <= 1) return;
    setSections(prev => prev.filter((_, idx) => idx !== index));
  };

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        name: `SECTION ${String.fromCharCode(65 + prev.length)} - Additional Questions`,
        description: 'Board assessment section',
        questionType: 'short_answer',
        questionCount: 2,
        marksPerQuestion: 3
      }
    ]);
  };

  const handleGenerate = async () => {
    if (!selectedChapter) {
      setErrorMessage('Please select a curriculum chapter first.');
      return;
    }

    if (!activeProviderConfig?.apiKey?.trim() && activeProviderConfig.type !== 'groq') {
      setErrorMessage(`Please configure an API Key for ${activeProviderConfig.name} in Settings before generating.`);
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const provider = AIService.createProvider(activeProviderConfig);
      const blueprint: QuestionPaperBlueprint = {
        title: `${paperTitle} - ${selectedChapter.title}`,
        schoolName,
        boardId,
        academicYear,
        classGrade,
        subjectId,
        chapterId: selectedChapter.id,
        chapterTitle: selectedChapter.title,
        durationMinutes,
        totalMarks: totalCalculatedMarks,
        difficulty,
        sections
      };

      const paper = await QuestionPaperGenerator.generate(selectedChapter, blueprint, provider);
      onPaperGenerated(paper);
    } catch (err: any) {
      console.error('Question Paper Generation Error:', err);
      setErrorMessage(err.message || 'Failed to generate question paper. Please verify your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Rich Multi-Step Generation Loader Modal */}
      <GenerationLoaderModal
        isOpen={isGenerating}
        title={`Generating ${totalCalculatedMarks}-Mark ${boardId.toUpperCase()} Question Paper`}
        subtitle={`Synthesizing board-aligned questions strictly from official context of "${selectedChapter?.title}".`}
        steps={[
          `Extracting verified syllabus context for Chapter: ${selectedChapter?.title}...`,
          `Structuring ${sections.length} assessment sections across ${difficulty.toUpperCase()} difficulty...`,
          `Generating MCQs, Assertion-Reason, Short & Case-based questions with ${activeProviderConfig?.name}...`,
          `Validating question schema, marks distribution, and model answers...`,
          `Finalizing printable ${boardId.toUpperCase()} exam layout...`
        ]}
      />

      <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-xl shadow-sm p-5 sm:p-7 transition-colors">
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#e5e3df] dark:border-[#243769] mb-5 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#5645d4]" />
              <h2 className="text-base sm:text-lg font-bold text-[#1a1a1a] dark:text-[#f6f5f4]">
                Board Assessment Blueprint Configurator
              </h2>
            </div>
            <p className="text-xs text-[#5d5b54] dark:text-[#a4a097] mt-0.5">
              Configure examination parameters, section marks, and difficulty blueprint.
            </p>
          </div>

          {/* Total Marks Badge */}
          <div className="flex items-center space-x-2 bg-[#e6e0f5] dark:bg-[#5645d4]/20 border border-[#5645d4]/30 px-3.5 py-1.5 rounded-lg">
            <Award className="w-4 h-4 text-[#5645d4]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#5d5b54] dark:text-[#a4a097] block leading-none">Total</span>
              <span className="text-base font-bold text-[#5645d4]">{totalCalculatedMarks} Marks</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-lg bg-[#fde0ec] dark:bg-red-950/40 border border-[#e03131]/30 text-[#e03131] dark:text-red-300 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Generation Notice: </span>
              <span>{errorMessage}</span>
              {errorMessage.includes('Settings') && (
                <Link href="/settings" className="block mt-1 underline font-bold text-[#5645d4]">
                  Go to AI Provider Settings →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Basic Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          {/* School Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              School / Academy Name
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md px-3 py-2 pl-9 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none shadow-2xs transition-colors"
                placeholder="e.g. National Model Senior Secondary School"
              />
            </div>
          </div>

          {/* Paper Title */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              Assessment Name
            </label>
            <input
              type="text"
              value={paperTitle}
              onChange={(e) => setPaperTitle(e.target.value)}
              className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none shadow-2xs transition-colors"
              placeholder="e.g. Periodic Assessment Test"
            />
          </div>

          {/* Exam Duration */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              Exam Duration
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md px-3 py-2 pl-9 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none cursor-pointer shadow-2xs transition-colors"
              >
                <option value={45} className="dark:bg-[#0f1c3d]">45 Minutes (Class Test)</option>
                <option value={60} className="dark:bg-[#0f1c3d]">60 Minutes (Unit Test)</option>
                <option value={90} className="dark:bg-[#0f1c3d]">90 Minutes (Periodic Test - 40M)</option>
                <option value={120} className="dark:bg-[#0f1c3d]">120 Minutes (Pre-Board - 50M)</option>
                <option value={180} className="dark:bg-[#0f1c3d]">180 Minutes (Annual Board - 80M)</option>
              </select>
            </div>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              Difficulty Distribution
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md px-3 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] font-medium outline-none cursor-pointer shadow-2xs transition-colors"
            >
              <option value="easy" className="dark:bg-[#0f1c3d]">Easy (60% Direct, 40% Conceptual)</option>
              <option value="medium" className="dark:bg-[#0f1c3d]">Medium (Standard Board Blueprint)</option>
              <option value="hard" className="dark:bg-[#0f1c3d]">Hard (Advanced HOTS & Numerical)</option>
              <option value="mixed" className="dark:bg-[#0f1c3d]">Mixed (Balanced CBSE Standard: 30-50-20)</option>
            </select>
          </div>

          {/* Active AI Provider Notice */}
          <div>
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
              AI Engine
            </label>
            <div className="flex items-center justify-between p-2 bg-[#f6f5f4] dark:bg-[#16254c] border border-[#e5e3df] dark:border-[#243769] rounded-md text-sm">
              <div className="flex items-center space-x-2 truncate">
                <Cpu className="w-4 h-4 text-[#5645d4] shrink-0" />
                <span className="font-semibold text-xs text-[#1a1a1a] dark:text-[#f6f5f4] truncate">{activeProviderConfig?.name}</span>
              </div>
              <Link href="/settings" className="text-xs text-[#5645d4] font-bold hover:underline shrink-0 ml-2">
                Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Sections Table */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider">
              Section Breakdown & Question Types
            </label>
            <button
              onClick={addSection}
              className="flex items-center space-x-1 text-xs text-[#5645d4] hover:underline font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="border border-[#e5e3df] dark:border-[#243769] rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-[#f6f5f4] dark:bg-[#16254c] border-b border-[#e5e3df] dark:border-[#243769] text-[#5d5b54] dark:text-[#a4a097] font-bold text-[11px] uppercase">
                  <th className="p-2.5 pl-3">Section Name</th>
                  <th className="p-2.5">Question Type</th>
                  <th className="p-2.5 w-24 text-center">No. of Qs</th>
                  <th className="p-2.5 w-24 text-center">Marks / Q</th>
                  <th className="p-2.5 w-24 text-right">Subtotal</th>
                  <th className="p-2.5 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e3df] dark:divide-[#243769] bg-white dark:bg-[#0f1c3d]">
                {sections.map((section, idx) => (
                  <tr key={idx} className="hover:bg-[#f6f5f4]/40 dark:hover:bg-[#16254c]/40 transition-colors">
                    <td className="p-2.5 pl-3">
                      <input
                        type="text"
                        value={section.name}
                        onChange={(e) => updateSection(idx, 'name', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-[#5645d4] outline-none font-semibold text-[#1a1a1a] dark:text-[#f6f5f4] text-xs sm:text-sm"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={section.questionType}
                        onChange={(e) => updateSection(idx, 'questionType', e.target.value)}
                        className="bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] rounded px-2 py-1 text-xs text-[#1a1a1a] dark:text-[#f6f5f4] outline-none font-medium"
                      >
                        <option value="mcq" className="dark:bg-[#0f1c3d]">MCQ / Objective (1 Mark)</option>
                        <option value="assertion_reason" className="dark:bg-[#0f1c3d]">Assertion-Reason (1 Mark)</option>
                        <option value="very_short" className="dark:bg-[#0f1c3d]">Very Short Answer (2 Marks)</option>
                        <option value="short_answer" className="dark:bg-[#0f1c3d]">Short Answer (3 Marks)</option>
                        <option value="long_answer" className="dark:bg-[#0f1c3d]">Long Answer (5 Marks)</option>
                        <option value="case_based" className="dark:bg-[#0f1c3d]">Case-Based / Competency (4 Marks)</option>
                      </select>
                    </td>
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={section.questionCount}
                        onChange={(e) => updateSection(idx, 'questionCount', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 text-center bg-white dark:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4] border border-[#c8c4be] dark:border-[#243769] rounded py-1 text-xs font-mono font-bold"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={section.marksPerQuestion}
                        onChange={(e) => updateSection(idx, 'marksPerQuestion', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-14 text-center bg-white dark:bg-[#16254c] text-[#1a1a1a] dark:text-[#f6f5f4] border border-[#c8c4be] dark:border-[#243769] rounded py-1 text-xs font-mono font-bold"
                      />
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-[#5645d4] text-xs sm:text-sm">
                      {section.questionCount * section.marksPerQuestion} M
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => removeSection(idx)}
                        disabled={sections.length <= 1}
                        className="text-[#787671] hover:text-[#e03131] disabled:opacity-20 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-[#e5e3df] dark:border-[#243769] gap-3">
          <div className="text-xs text-[#5d5b54] dark:text-[#a4a097] flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1aae39]" />
            <span>Questions constrained to: <strong className="text-[#1a1a1a] dark:text-[#f6f5f4]">{selectedChapter?.title}</strong></span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedChapter}
            className="flex items-center space-x-2 bg-[#5645d4] hover:bg-[#4534b3] disabled:opacity-50 text-white font-medium text-sm px-6 py-2.5 rounded-md transition-colors shadow-sm cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating {totalCalculatedMarks}M Exam Paper with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Official {totalCalculatedMarks}-Mark Question Paper</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

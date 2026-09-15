import { BoardId, ClassGrade, SubjectId } from '../curriculum/types';

export type DPPDifficulty = 'foundation' | 'moderate' | 'advanced' | 'progressive';

export type DPPQuestionType = 'mcq' | 'assertion_reason' | 'short_answer' | 'numerical' | 'hots';

export interface DPPConfig {
  daysCount: number; // 1 to 5 days
  questionsPerDay: number; // 5, 10, 15, 20
  difficulty: DPPDifficulty;
  durationMinutesPerDay: number; // 15, 30, 45, 60
  questionTypes: DPPQuestionType[];
  includeSolutions: boolean;
  includeHints: boolean;
  customInstructions?: string;
}

export interface DPPQuestion {
  id: string;
  questionNumber: number;
  type: DPPQuestionType;
  questionText: string;
  options?: string[]; // for MCQ (A, B, C, D)
  correctAnswer: string;
  solutionSteps: string[];
  hint?: string;
  marks: number;
  bloomsLevel?: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
  conceptCovered?: string;
  formulaUsed?: string;
}

export interface DPPDayPlan {
  dayNumber: number;
  dayTitle: string; // e.g. "Day 1: Fundamental Concepts & Conceptual MCQs"
  focusConcept: string;
  estimatedMinutes: number;
  totalMarks: number;
  questions: DPPQuestion[];
}

export interface DPPPlan {
  id: string;
  title: string;
  chapterId: string;
  chapterTitle: string;
  chapterCode: string;
  boardId: BoardId;
  classGrade: ClassGrade;
  subjectId: SubjectId;
  academicYear: string;
  totalDays: number;
  totalQuestions: number;
  totalMarks: number;
  config: DPPConfig;
  days: DPPDayPlan[];
  generatedAt: string;
  modelUsed: string;
}

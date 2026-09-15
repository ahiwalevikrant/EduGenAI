import { GeneratedQuestionPaper, QuestionType } from '../question-paper/types';

export interface StepEvaluation {
  stepNumber: number;
  description: string;
  marksAwarded: number;
}

export interface AnswerKeyItem {
  id: string;
  qNumber: number;
  questionText: string;
  type: QuestionType;
  marks: number;
  correctOptionKey?: 'A' | 'B' | 'C' | 'D';
  finalAnswer: string;
  keyPoints: string[];
  stepByStepSolution: string;
  stepEvaluations?: StepEvaluation[];
  commonPitfalls?: string;
  markingCriteria: string;
}

export interface GeneratedAnswerKey {
  id: string;
  paperId: string;
  paperTitle: string;
  schoolName: string;
  boardName: string;
  academicYear: string;
  classGrade: string;
  subjectName: string;
  chapterTitle: string;
  totalMarks: number;
  evaluatorInstructions: string[];
  items: AnswerKeyItem[];
  createdAt: string;
}

import { BoardId, AcademicYear, ClassGrade, SubjectId } from '../curriculum/types';

export type QuestionType = 
  | 'mcq'
  | 'assertion_reason'
  | 'very_short'
  | 'short_answer'
  | 'long_answer'
  | 'case_based'
  | 'competency_based';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface SubQuestion {
  subNumber: string; // e.g. "i", "ii", "iii"
  questionText: string;
  marks: number;
  expectedAnswer?: string;
}

export interface QuestionItem {
  id: string;
  qNumber: number;
  sectionId: string;
  type: QuestionType;
  questionText: string;
  marks: number;
  options?: QuestionOption[]; // for MCQ
  assertion?: string; // for Assertion-Reason
  reason?: string;    // for Assertion-Reason
  caseScenario?: string; // for Case-based
  subQuestions?: SubQuestion[]; // for Case-based
  sourceTopic?: string;
  expectedAnswer: string;
  stepMarks?: { step: string; marks: number }[];
  markingNotes?: string;
}

export interface SectionStructure {
  id: string;
  name: string; // e.g. "SECTION A - Objective & MCQs"
  description: string;
  questionType: QuestionType;
  questionCount: number;
  marksPerQuestion: number;
  totalMarks: number;
  questions: QuestionItem[];
}

export interface QuestionPaperBlueprint {
  title: string;
  schoolName: string;
  boardId: BoardId;
  academicYear: AcademicYear;
  classGrade: ClassGrade;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  durationMinutes: number; // e.g. 60, 90, 180
  totalMarks: number;     // e.g. 25, 40, 50, 80
  difficulty: DifficultyLevel;
  sections: {
    name: string;
    description: string;
    questionType: QuestionType;
    questionCount: number;
    marksPerQuestion: number;
  }[];
}

export interface GeneratedQuestionPaper {
  id: string;
  title: string;
  schoolName: string;
  boardName: string;
  academicYear: string;
  classGrade: string;
  subjectName: string;
  chapterCode: string;
  chapterTitle: string;
  officialSourceUrl: string;
  durationMinutes: number;
  totalMarks: number;
  difficulty: DifficultyLevel;
  generalInstructions: string[];
  sections: SectionStructure[];
  createdAt: string;
}

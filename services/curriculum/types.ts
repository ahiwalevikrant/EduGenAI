export type BoardId = 'cbse' | 'maharashtra' | 'icse';
export type AcademicYear = '2026-27' | '2025-26' | '2024-25';
export type ClassGrade = '7' | '8' | '9' | '10';

export type SubjectId = 
  | 'science'
  | 'mathematics'
  | 'social_science'
  | 'english'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history_civics'
  | 'geography';

export interface BoardInfo {
  id: BoardId;
  name: string;
  fullName: string;
  country: string;
  primarySource: string;
  sourceUrl: string;
  textbookAuthority: string;
  textbookUrl: string;
  badgeColor: string;
  description: string;
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  icon: string;
  code?: string;
  description: string;
}

export interface OfficialSource {
  authority: string;
  sourceType: 'Textbook' | 'Syllabus' | 'Curriculum Framework' | 'Exemplar';
  publicationYear: string;
  bookTitle: string;
  chapterCode?: string;
  url: string;
  verifiedDate: string;
  isOfficial: boolean;
}

export interface ChapterConcept {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  formulas?: string[];
  definitions?: { term: string; definition: string }[];
  diagramSuggestions?: string[];
}

export interface ChapterActivity {
  id: string;
  activityNumber: string;
  title: string;
  objective: string;
  materials?: string[];
  procedure?: string[];
  conclusion?: string;
}

export interface Chapter {
  id: string;
  boardId: BoardId;
  academicYear: AcademicYear;
  classGrade: ClassGrade;
  subjectId: SubjectId;
  chapterNumber: number;
  code: string; // e.g., CBSE-SCI9-CH07
  title: string;
  tagline: string;
  source: OfficialSource;
  learningObjectives: string[];
  coreConcepts: ChapterConcept[];
  activities: ChapterActivity[];
  importantTerms: { term: string; definition: string }[];
  fullSummary: string;
  assessmentWeightage?: string;
  suggestedTeachingPeriods?: number;
  sampleQuestionsCount?: number;
}

export interface CurriculumFilter {
  boardId: BoardId;
  academicYear: AcademicYear;
  classGrade: ClassGrade;
  subjectId: SubjectId;
  chapterId?: string;
}

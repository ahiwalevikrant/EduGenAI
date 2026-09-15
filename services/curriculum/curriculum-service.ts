import { BoardId, BoardInfo, AcademicYear, ClassGrade, SubjectId, SubjectInfo, Chapter, CurriculumFilter } from './types';
import { CBSE_CHAPTERS } from './cbse-catalog';
import { MAHARASHTRA_CHAPTERS } from './maharashtra-catalog';
import { ICSE_CHAPTERS } from './icse-catalog';

export const BOARDS: BoardInfo[] = [
  {
    id: 'cbse',
    name: 'CBSE',
    fullName: 'Central Board of Secondary Education',
    country: 'India (National)',
    primarySource: 'CBSE Academic Official Portal',
    sourceUrl: 'https://cbseacademic.nic.in',
    textbookAuthority: 'NCERT (National Council of Educational Research and Training)',
    textbookUrl: 'https://ncert.nic.in/textbook.php',
    badgeColor: 'jira-blue',
    description: 'National curriculum framework following NCERT textbooks & NEP 2020 competency-based guidelines.'
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra State Board',
    fullName: 'Maharashtra State Board of Secondary and Higher Secondary Education (MSBSHSE)',
    country: 'India (State)',
    primarySource: 'Maharashtra Academic Authority (SCERT Pune)',
    sourceUrl: 'https://maa.ac.in',
    textbookAuthority: 'Balbharati (eBalbharati Publication)',
    textbookUrl: 'https://ebalbharati.in',
    badgeColor: 'jira-teal',
    description: 'Official state curriculum prescribed by Balbharati textbooks for Maharashtra SSC board.'
  },
  {
    id: 'icse',
    name: 'ICSE (CISCE)',
    fullName: 'Council for the Indian School Certificate Examinations',
    country: 'India (National / International)',
    primarySource: 'CISCE Official Portal',
    sourceUrl: 'https://cisce.org',
    textbookAuthority: 'CISCE Prescribed Curriculum & Syllabuses',
    textbookUrl: 'https://cisce.org/regulations-and-syllabuses/',
    badgeColor: 'jira-purple',
    description: 'In-depth comprehensive curriculum designed for application-oriented conceptual understanding.'
  }
];

export const ACADEMIC_YEARS: AcademicYear[] = ['2026-27', '2025-26', '2024-25'];

export const CLASS_GRADES: { grade: ClassGrade; label: string }[] = [
  { grade: '7', label: 'Class 7 (Standard VII)' },
  { grade: '8', label: 'Class 8 (Standard VIII)' },
  { grade: '9', label: 'Class 9 (Standard IX)' },
  { grade: '10', label: 'Class 10 (Standard X)' }
];

export const ALL_SUBJECTS: SubjectInfo[] = [
  { id: 'science', name: 'Science', icon: 'Atom', code: 'SCI', description: 'Physics, Chemistry, Biology integrated' },
  { id: 'mathematics', name: 'Mathematics', icon: 'Calculator', code: 'MATH', description: 'Arithmetic, Algebra, Geometry, Statistics' },
  { id: 'social_science', name: 'Social Science', icon: 'Globe', code: 'SST', description: 'History, Geography, Political Science, Economics' },
  { id: 'english', name: 'English Language & Literature', icon: 'BookOpen', code: 'ENG', description: 'Reading, Grammar, Writing & Literature' },
  { id: 'physics', name: 'Physics', icon: 'Zap', code: 'PHY', description: 'Mechanics, Energy, Electricity & Light' },
  { id: 'chemistry', name: 'Chemistry', icon: 'FlaskConical', code: 'CHEM', description: 'Elements, Compounds, Reactions' },
  { id: 'biology', name: 'Biology', icon: 'Dna', code: 'BIO', description: 'Life processes, Genetics, Ecology' },
  { id: 'history_civics', name: 'History & Civics', icon: 'Landmark', code: 'HC', description: 'Indian and World History, Constitution' },
  { id: 'geography', name: 'Geography', icon: 'Compass', code: 'GEO', description: 'Physical and Economic Geography' }
];

export class CurriculumService {
  private static allChapters: Chapter[] = [
    ...CBSE_CHAPTERS,
    ...MAHARASHTRA_CHAPTERS,
    ...ICSE_CHAPTERS
  ];

  static getBoards(): BoardInfo[] {
    return BOARDS;
  }

  static getBoardById(id: BoardId): BoardInfo | undefined {
    return BOARDS.find(b => b.id === id);
  }

  static getSubjectsForBoardAndClass(boardId: BoardId, classGrade: ClassGrade): SubjectInfo[] {
    if (boardId === 'icse' && (classGrade === '9' || classGrade === '10')) {
      return ALL_SUBJECTS.filter(s => ['physics', 'chemistry', 'biology', 'mathematics', 'history_civics', 'geography', 'english'].includes(s.id));
    }
    return ALL_SUBJECTS.filter(s => ['science', 'mathematics', 'social_science', 'english'].includes(s.id));
  }

  static getChapters(filter: CurriculumFilter): Chapter[] {
    return this.allChapters.filter(ch => {
      const matchBoard = ch.boardId === filter.boardId;
      const matchClass = ch.classGrade === filter.classGrade;
      const matchSubject = ch.subjectId === filter.subjectId;
      return matchBoard && matchClass && matchSubject;
    });
  }

  static getChapterById(id: string): Chapter | undefined {
    return this.allChapters.find(ch => ch.id === id);
  }

  static searchChapters(query: string): Chapter[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.allChapters;
    return this.allChapters.filter(ch => 
      ch.title.toLowerCase().includes(q) ||
      ch.code.toLowerCase().includes(q) ||
      ch.fullSummary.toLowerCase().includes(q) ||
      ch.learningObjectives.some(lo => lo.toLowerCase().includes(q)) ||
      ch.coreConcepts.some(cc => cc.title.toLowerCase().includes(q) || cc.summary.toLowerCase().includes(q))
    );
  }

  static getAllChapters(): Chapter[] {
    return this.allChapters;
  }
}

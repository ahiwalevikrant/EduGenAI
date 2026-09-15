export type SlideType = 
  | 'title'
  | 'objectives'
  | 'concept'
  | 'diagram_visual'
  | 'activity'
  | 'interactive_quiz'
  | 'exam_tips'
  | 'summary'
  | 'homework';

export type TeachingStyle = 
  | 'concept-focused'
  | 'interactive'
  | 'exam-focused'
  | 'visual'
  | 'revision';

export type SlideThemeId = 'jira_blue' | 'academic_slate' | 'emerald_modern' | 'minimal_clean' | 'dark_navy';

export interface SlideTheme {
  id: SlideThemeId;
  name: string;
  bgColor: string;
  textColor: string;
  primaryColor: string;
  accentColor: string;
  cardBg: string;
}

export interface SlideItem {
  id: string;
  slideNumber: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  keyFormula?: string;
  calloutBox?: {
    type: 'tip' | 'warning' | 'activity' | 'example';
    title: string;
    content: string;
  };
  speakerNotes: string;
  visualSuggestion?: string;
  imagePrompt?: string;
  generatedImageUrl?: string;
}

export interface PPTDeck {
  id: string;
  title: string;
  subtitle: string;
  boardName: string;
  academicYear: string;
  classGrade: string;
  subjectName: string;
  chapterTitle: string;
  chapterCode: string;
  teachingStyle: TeachingStyle;
  durationMinutes: number;
  themeId: SlideThemeId;
  slides: SlideItem[];
  createdAt: string;
}

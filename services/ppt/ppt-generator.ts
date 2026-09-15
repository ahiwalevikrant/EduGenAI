import { Chapter } from '../curriculum/types';
import { ContextBuilder } from '../web-source/context-builder';
import { AIProvider } from '../ai/ai-provider.interface';
import { PPTDeck, SlideItem, TeachingStyle, SlideThemeId } from './types';

export interface PPTConfig {
  slideCount: number; // e.g., 8, 12, 15, 20
  teachingDuration: number; // minutes: 30, 45, 60
  teachingStyle: TeachingStyle;
  themeId: SlideThemeId;
}

export class PPTGenerator {
  /**
   * Generates a pedagogical, classroom-ready presentation deck.
   */
  static async generate(
    chapter: Chapter,
    config: PPTConfig,
    provider: AIProvider
  ): Promise<PPTDeck> {
    const context = ContextBuilder.buildContext(chapter);

    const systemPrompt = `You are a Master Educator and Pedagogical Curriculum Specialist for the ${chapter.boardId.toUpperCase()} Board.
Your mission is to construct an engaging, highly structured, classroom-ready teaching slide deck for ${chapter.title}.

PEDAGOGICAL TEACHING STYLE: "${config.teachingStyle.toUpperCase()}"
- If "concept-focused": Dive deep into step-by-step intuition, derivations, definitions, and micro-breakdowns.
- If "interactive": Include live discussion prompts, think-pair-share questions, and student polling questions.
- If "exam-focused": Highlight previous board questions, high-scoring keywords, common mistakes, and marking schemes.
- If "visual": Provide vivid visual diagram prompts, flowchart outlines, and spatial concept representations.
- If "revision": Condensed quick summaries, formula reference cheat sheets, and lightning round quiz questions.

CRITICAL SLIDE DESIGN RULES:
1. Generate EXACTLY ${config.slideCount} slides.
2. Structure:
   - Slide 1: Chapter Title, Grade, Subject, Board Alignment
   - Slide 2: Clear Learning Objectives & Outcomes
   - Slide 3: Engaging Real-World Hook & Introduction
   - Middle Slides: Core Concept Explanations, Key Formulas, Examples, Visual Diagram Suggestions, NCERT Activities
   - Penultimate Slide: Quick Concept Check / MCQ Quiz / Important Board Exam Tips
   - Final Slide: Chapter Summary & Homework / Assignment
3. Keep bullet points concise and readable for projection (3-5 bullets per slide).
4. Include detailed 'speakerNotes' for the teacher on every slide.
5. Provide precise 'imagePrompt' or 'visualSuggestion' describing educational diagrams.
6. Return ONLY valid JSON matching the specified schema.`;

    const prompt = `
Create a ${config.slideCount}-slide PowerPoint presentation for:
Chapter: ${chapter.title} (Code: ${chapter.code})
Class: Class ${chapter.classGrade} | Subject: ${chapter.subjectId}
Board: ${chapter.boardId.toUpperCase()} (${chapter.academicYear})
Class Duration: ${config.teachingDuration} Minutes
Style: ${config.teachingStyle}

=== OFFICIAL CHAPTER CONTEXT ===
${context.fullContextString}

=== REQUIRED JSON OUTPUT SCHEMA ===
{
  "title": "${chapter.title}",
  "subtitle": "Complete Comprehensive Masterclass | Class ${chapter.classGrade} ${chapter.subjectId}",
  "slides": [
    {
      "slideNumber": 1,
      "type": "title",
      "title": "${chapter.title}",
      "subtitle": "Class ${chapter.classGrade} ${chapter.subjectId} • ${chapter.boardId.toUpperCase()} 2026-27",
      "bulletPoints": [
        "Official Textbook Curriculum: ${chapter.source.bookTitle}",
        "Target Duration: ${config.teachingDuration} Minutes",
        "Pedagogical Focus: ${config.teachingStyle}"
      ],
      "speakerNotes": "Welcome students to today's masterclass. Outline the learning journey.",
      "visualSuggestion": "Engaging banner illustration representing the physical concepts of ${chapter.title}.",
      "imagePrompt": "A modern, high-contrast educational graphic showing dynamic motion vectors, trajectory curves, and velocity indicators in vibrant colors."
    }
  ]
}
`;

    const rawResponse = await provider.generateStructured<{
      title: string;
      subtitle: string;
      slides: any[];
    }>(prompt, {
      systemPrompt,
      temperature: 0.35,
      maxTokens: 4000
    });

    const slides: SlideItem[] = (rawResponse.slides || []).map((s, idx) => ({
      id: `slide-${Date.now()}-${idx + 1}`,
      slideNumber: idx + 1,
      type: s.type || (idx === 0 ? 'title' : idx === 1 ? 'objectives' : 'concept'),
      title: s.title || `Slide ${idx + 1}: ${chapter.title}`,
      subtitle: s.subtitle || undefined,
      bulletPoints: Array.isArray(s.bulletPoints) ? s.bulletPoints : [s.content || 'Key concept discussion'],
      keyFormula: s.keyFormula || undefined,
      calloutBox: s.calloutBox || undefined,
      speakerNotes: s.speakerNotes || 'Discuss the core intuition with students and ask verifying questions.',
      visualSuggestion: s.visualSuggestion || undefined,
      imagePrompt: s.imagePrompt || undefined,
      generatedImageUrl: undefined
    }));

    return {
      id: `deck-${Date.now()}`,
      title: rawResponse.title || chapter.title,
      subtitle: rawResponse.subtitle || `Class ${chapter.classGrade} ${chapter.subjectId} • ${chapter.boardId.toUpperCase()}`,
      boardName: chapter.boardId.toUpperCase(),
      academicYear: chapter.academicYear,
      classGrade: chapter.classGrade,
      subjectName: chapter.subjectId,
      chapterTitle: chapter.title,
      chapterCode: chapter.code,
      teachingStyle: config.teachingStyle,
      durationMinutes: config.teachingDuration,
      themeId: config.themeId,
      slides,
      createdAt: new Date().toISOString()
    };
  }
}

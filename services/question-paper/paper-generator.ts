import { Chapter } from '../curriculum/types';
import { ContextBuilder } from '../web-source/context-builder';
import { AIProvider } from '../ai/ai-provider.interface';
import { GeneratedQuestionPaper, QuestionPaperBlueprint, SectionStructure, QuestionItem } from './types';

export class QuestionPaperGenerator {
  /**
   * Generates a fully board-aligned question paper using the teacher's selected AI provider.
   */
  static async generate(
    chapter: Chapter,
    blueprint: QuestionPaperBlueprint,
    provider: AIProvider
  ): Promise<GeneratedQuestionPaper> {
    const context = ContextBuilder.buildContext(chapter);

    const systemPrompt = `You are a Senior Chief Examination Paper Setter for the ${blueprint.boardId.toUpperCase()} Academic Board.
You have been tasked with preparing a highly rigorous, authentic, syllabus-aligned Summative/Periodic Question Paper for ${chapter.title}.

CRITICAL PEDAGOGICAL RULES:
1. Grounding: All questions MUST be strictly derived from the provided Chapter Curriculum Context. Do not include questions from topics outside this chapter.
2. Board Assessment Pattern:
   - Section A: Multiple Choice Questions (MCQs) and Assertion-Reason questions with 4 distinct options (A, B, C, D) and clear correct keys.
   - Section B: Very Short Answer (VSA) conceptual definitions / 1-2 step calculations.
   - Section C: Short Answer (SA) scientific explanations, numerical derivations, or comparisons.
   - Section D: Long Answer (LA) multi-part analytical questions, comprehensive derivations, or experiments.
   - Section E: Case-Based / Source-Based Integrated Competency questions with a realistic scenario paragraph followed by 2-3 sub-questions.
3. Difficulty distribution: Target ${blueprint.difficulty.toUpperCase()} difficulty level.
4. Output Format: You MUST return ONLY valid JSON matching the exact schema specified. Do not include markdown preamble or conversational text.`;

    const prompt = `
Generate a ${blueprint.totalMarks} Marks question paper for:
Class: ${blueprint.classGrade}
Subject: ${blueprint.subjectId}
Chapter: ${chapter.title} (Code: ${chapter.code})
Academic Year: ${blueprint.academicYear}
Exam Duration: ${blueprint.durationMinutes} Minutes
Difficulty: ${blueprint.difficulty}

=== SECTIONS TO GENERATE ===
${blueprint.sections.map((s, idx) => `Section ${idx + 1}: "${s.name}" -> ${s.questionCount} questions of type "${s.questionType}", ${s.marksPerQuestion} marks each (Total Section Marks: ${s.questionCount * s.marksPerQuestion})`).join('\n')}

=== OFFICIAL CHAPTER SYLLABUS & TEXTBOOK CONTEXT ===
${context.fullContextString}

=== REQUIRED JSON OUTPUT STRUCTURE ===
{
  "generalInstructions": [
    "This question paper consists of ${blueprint.sections.length} sections.",
    "All questions are compulsory. Internal choice is provided where appropriate.",
    "Section A contains MCQs carrying 1 mark each.",
    "Use of calculators is not permitted."
  ],
  "sections": [
    {
      "name": "SECTION A - Objective & MCQs",
      "description": "Select the correct option for each question.",
      "questionType": "mcq",
      "marksPerQuestion": 1,
      "questions": [
        {
          "qNumber": 1,
          "type": "mcq",
          "questionText": "An object moves along a circular path of radius r. What is the displacement after completing half a revolution?",
          "marks": 1,
          "options": [
            { "key": "A", "text": "Zero" },
            { "key": "B", "text": "πr" },
            { "key": "C", "text": "2r" },
            { "key": "D", "text": "2πr" }
          ],
          "sourceTopic": "Describing Motion & Reference Points",
          "expectedAnswer": "Option C (2r)",
          "markingNotes": "1 mark for correct option C (diameter of circular path)."
        }
      ]
    }
  ]
}

Return ONLY the JSON structure matching this chapter's exact questions.`;

    const rawResponse = await provider.generateStructured<{
      generalInstructions: string[];
      sections: any[];
    }>(prompt, {
      systemPrompt,
      temperature: 0.25,
      maxTokens: 4000
    });

    let currentQNumber = 1;
    const formattedSections: SectionStructure[] = (rawResponse.sections || []).map((sec, secIdx) => {
      const blueprintSec = blueprint.sections[secIdx] || {
        name: sec.name || `Section ${secIdx + 1}`,
        description: sec.description || '',
        questionType: sec.questionType || 'short_answer',
        questionCount: sec.questions?.length || 1,
        marksPerQuestion: sec.marksPerQuestion || 1
      };

      const questions: QuestionItem[] = (sec.questions || []).map((q: any) => {
        const item: QuestionItem = {
          id: `q-${Date.now()}-${currentQNumber}`,
          qNumber: currentQNumber++,
          sectionId: `sec-${secIdx + 1}`,
          type: q.type || blueprintSec.questionType || 'short_answer',
          questionText: q.questionText || 'Question text',
          marks: q.marks || blueprintSec.marksPerQuestion || 1,
          options: q.options || undefined,
          assertion: q.assertion || undefined,
          reason: q.reason || undefined,
          caseScenario: q.caseScenario || undefined,
          subQuestions: q.subQuestions || undefined,
          sourceTopic: q.sourceTopic || chapter.title,
          expectedAnswer: q.expectedAnswer || 'See marking scheme',
          stepMarks: q.stepMarks || undefined,
          markingNotes: q.markingNotes || ''
        };
        return item;
      });

      const totalSectionMarks = questions.reduce((acc, q) => acc + q.marks, 0);

      return {
        id: `sec-${secIdx + 1}`,
        name: sec.name || blueprintSec.name,
        description: sec.description || blueprintSec.description,
        questionType: sec.questionType || blueprintSec.questionType,
        questionCount: questions.length,
        marksPerQuestion: blueprintSec.marksPerQuestion,
        totalMarks: totalSectionMarks,
        questions
      };
    });

    const calculatedTotal = formattedSections.reduce((acc, s) => acc + s.totalMarks, 0);

    return {
      id: `qp-${Date.now()}`,
      title: blueprint.title || `${blueprint.boardId.toUpperCase()} Class ${blueprint.classGrade} ${blueprint.subjectId.toUpperCase()} Examination`,
      schoolName: blueprint.schoolName || 'DELHI PUBLIC ACADEMY / CENTRAL MODEL SCHOOL',
      boardName: blueprint.boardId.toUpperCase(),
      academicYear: blueprint.academicYear,
      classGrade: blueprint.classGrade,
      subjectName: blueprint.subjectId,
      chapterCode: chapter.code,
      chapterTitle: chapter.title,
      officialSourceUrl: chapter.source.url,
      durationMinutes: blueprint.durationMinutes,
      totalMarks: calculatedTotal || blueprint.totalMarks,
      difficulty: blueprint.difficulty,
      generalInstructions: rawResponse.generalInstructions?.length 
        ? rawResponse.generalInstructions 
        : [
          `This question paper consists of ${formattedSections.length} sections.`,
          'All questions are compulsory.',
          `Total duration is ${blueprint.durationMinutes} minutes. Maximum Marks: ${calculatedTotal || blueprint.totalMarks}.`,
          'Draw neat, labeled diagrams wherever necessary.'
        ],
      sections: formattedSections,
      createdAt: new Date().toISOString()
    };
  }
}

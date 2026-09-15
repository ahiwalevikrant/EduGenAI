import { GeneratedQuestionPaper } from '../question-paper/types';
import { GeneratedAnswerKey, AnswerKeyItem } from './types';
import { AIProvider } from '../ai/ai-provider.interface';
import { Chapter } from '../curriculum/types';
import { ContextBuilder } from '../web-source/context-builder';

export class AnswerKeyGenerator {
  /**
   * Generates a step-by-step Marking Scheme & Answer Key for a generated Question Paper.
   */
  static async generate(
    paper: GeneratedQuestionPaper,
    chapter: Chapter,
    provider: AIProvider
  ): Promise<GeneratedAnswerKey> {
    const context = ContextBuilder.buildContext(chapter);

    // Flatten all questions
    const allQuestions = paper.sections.flatMap(s => s.questions);

    const systemPrompt = `You are a Senior Chief Evaluator / Moderator for the ${paper.boardName} Academic Board.
Your task is to produce an authoritative, step-by-step Marking Scheme & Evaluation Rubric for teachers and evaluators.

CRITICAL EVALUATION RULES:
1. Provide exact, verified answers grounded in official ${chapter.source.bookTitle} text.
2. For MCQs: Specify the correct Option Key (A, B, C, or D) and explicit explanation.
3. For Numerical/Derivation problems: Provide clear step-by-step breakdown with mark distribution (e.g. 0.5 mark for formula, 1 mark for substitution, 0.5 mark for correct answer with SI units).
4. Highlight common student mistakes/pitfalls to assist teachers in grading fairly.
5. Return ONLY valid JSON format.`;

    const prompt = `
Generate an official Marking Scheme & Answer Key for:
Board: ${paper.boardName}
Class: ${paper.classGrade} | Subject: ${paper.subjectName}
Chapter: ${chapter.title}
Total Marks: ${paper.totalMarks}

=== QUESTIONS TO SOLVE ===
${allQuestions.map(q => `
Q${q.qNumber}. [${q.marks} Marks] [Type: ${q.type}]
Question: ${q.questionText}
${q.options ? `Options:\n${q.options.map(o => `  ${o.key}: ${o.text}`).join('\n')}` : ''}
${q.assertion ? `Assertion: ${q.assertion}\nReason: ${q.reason}` : ''}
${q.caseScenario ? `Scenario: ${q.caseScenario}\nSubquestions: ${JSON.stringify(q.subQuestions)}` : ''}
`).join('\n---\n')}

=== OFFICIAL CHAPTER CONTEXT ===
${context.fullContextString}

=== REQUIRED JSON OUTPUT STRUCTURE ===
{
  "evaluatorInstructions": [
    "Credit should be given for correct alternative conceptual approaches.",
    "Deduct 0.5 marks if SI unit is omitted or incorrect in numerical answers.",
    "Follow step-marking strictly as outlined in this rubric."
  ],
  "items": [
    {
      "qNumber": 1,
      "correctOptionKey": "C",
      "finalAnswer": "2r",
      "keyPoints": [
        "In half a revolution, object moves from one end of diameter to the opposite end.",
        "Shortest straight-line distance is diameter = 2r."
      ],
      "stepByStepSolution": "1. Half a revolution traverses a semi-circular arc of length πr.\\n2. Displacement is straight line distance connecting initial and final points.\\n3. Hence, displacement = 2 * r.",
      "stepEvaluations": [
        { "stepNumber": 1, "description": "Identification of diameter as shortest path", "marksAwarded": 0.5 },
        { "stepNumber": 2, "description": "Correct algebraic expression 2r", "marksAwarded": 0.5 }
      ],
      "commonPitfalls": "Students often confuse distance (πr) with displacement (2r).",
      "markingCriteria": "Full 1 mark for Option C (2r)."
    }
  ]
}
`;

    const rawResponse = await provider.generateStructured<{
      evaluatorInstructions: string[];
      items: any[];
    }>(prompt, {
      systemPrompt,
      temperature: 0.2,
      maxTokens: 4000
    });

    const itemsMap = new Map<number, any>();
    (rawResponse.items || []).forEach(item => {
      itemsMap.set(item.qNumber, item);
    });

    const formattedItems: AnswerKeyItem[] = allQuestions.map(q => {
      const aiItem = itemsMap.get(q.qNumber) || {};
      return {
        id: `ans-${paper.id}-${q.qNumber}`,
        qNumber: q.qNumber,
        questionText: q.questionText,
        type: q.type,
        marks: q.marks,
        correctOptionKey: aiItem.correctOptionKey || undefined,
        finalAnswer: aiItem.finalAnswer || q.expectedAnswer || 'Refer to textbook model answer.',
        keyPoints: aiItem.keyPoints || ['Correct conceptual definition and terminology.'],
        stepByStepSolution: aiItem.stepByStepSolution || q.expectedAnswer || 'Complete solution per board guidelines.',
        stepEvaluations: aiItem.stepEvaluations || [
          { stepNumber: 1, description: 'Conceptual understanding and key terms', marksAwarded: q.marks * 0.5 },
          { stepNumber: 2, description: 'Accurate conclusion / final result', marksAwarded: q.marks * 0.5 }
        ],
        commonPitfalls: aiItem.commonPitfalls || 'Verify conceptual clarity and precise scientific terminology.',
        markingCriteria: aiItem.markingCriteria || `${q.marks} marks as per board rubric.`
      };
    });

    return {
      id: `ak-${paper.id}`,
      paperId: paper.id,
      paperTitle: paper.title,
      schoolName: paper.schoolName,
      boardName: paper.boardName,
      academicYear: paper.academicYear,
      classGrade: paper.classGrade,
      subjectName: paper.subjectName,
      chapterTitle: chapter.title,
      totalMarks: paper.totalMarks,
      evaluatorInstructions: rawResponse.evaluatorInstructions?.length 
        ? rawResponse.evaluatorInstructions
        : [
          'Follow step-marking strictly as prescribed in the blueprint.',
          'Award marks for correct reasoning even if alternative standard terminology is used.',
          'Deduct 0.5 marks for missing or wrong SI units in calculation answers.'
        ],
      items: formattedItems,
      createdAt: new Date().toISOString()
    };
  }
}

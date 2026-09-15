import { Chapter } from '../curriculum/types';

export interface ChapterAIContext {
  chapterCode: string;
  title: string;
  boardName: string;
  academicYear: string;
  classGrade: string;
  subjectName: string;
  officialSource: string;
  sourceUrl: string;
  fullContextString: string;
  learningObjectives: string[];
  coreConceptsText: string;
  formulasText: string;
  activitiesText: string;
  keyTermsText: string;
  tokenEstimate: number;
}

export class ContextBuilder {
  /**
   * Build clean, structured pedagogical context from official chapter content.
   * This guarantees that the AI generates content grounded strictly in the official textbook/syllabus.
   */
  static buildContext(chapter: Chapter): ChapterAIContext {
    const boardName = chapter.boardId.toUpperCase();
    
    // Format Core Concepts
    const conceptsArray = chapter.coreConcepts.map((c, i) => {
      const pts = c.keyPoints.map(p => `  • ${p}`).join('\n');
      const defs = c.definitions && c.definitions.length > 0 
        ? '\n  Definitions:\n' + c.definitions.map(d => `    - ${d.term}: ${d.definition}`).join('\n')
        : '';
      const forms = c.formulas && c.formulas.length > 0
        ? '\n  Key Formulas:\n' + c.formulas.map(f => `    - ${f}`).join('\n')
        : '';
      return `Concept ${i + 1}: ${c.title}\nSummary: ${c.summary}\nKey Points:\n${pts}${defs}${forms}`;
    });
    const coreConceptsText = conceptsArray.join('\n\n');

    // Extract all formulas
    const allFormulas: string[] = [];
    chapter.coreConcepts.forEach(c => {
      if (c.formulas) allFormulas.push(...c.formulas);
    });
    const formulasText = allFormulas.length > 0 
      ? allFormulas.map(f => `• ${f}`).join('\n') 
      : 'No mathematical equations prescribed for this section.';

    // Format Activities
    const activitiesText = chapter.activities.length > 0
      ? chapter.activities.map(a => `${a.activityNumber}: ${a.title}\nObjective: ${a.objective}\nProcedure:\n${a.procedure?.map(p => `  1. ${p}`).join('\n') || 'N/A'}\nConclusion: ${a.conclusion || 'N/A'}`).join('\n\n')
      : 'Standard conceptual discussions and illustrations.';

    // Format Terms
    const keyTermsText = chapter.importantTerms.map(t => `• ${t.term}: ${t.definition}`).join('\n');

    // Assemble the complete pedagogical context block
    const fullContextString = `
[OFFICIAL CURRICULUM CONTEXT - STRICT GROUNDING]
BOARD: ${boardName}
ACADEMIC YEAR: ${chapter.academicYear}
CLASS: Class ${chapter.classGrade}
SUBJECT: ${chapter.subjectId}
CHAPTER ${chapter.chapterNumber}: ${chapter.title} (Code: ${chapter.code})
OFFICIAL SOURCE: ${chapter.source.authority} - ${chapter.source.bookTitle} (${chapter.source.publicationYear})
SOURCE PORTAL: ${chapter.source.url}

=== OFFICIAL LEARNING OBJECTIVES ===
${chapter.learningObjectives.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

=== CORE TOPICS & OFFICIAL SYLLABUS CONTENT ===
${coreConceptsText}

=== FORMULAS & EQUATIONS ===
${formulasText}

=== OFFICIAL NCERT/BOARD ACTIVITIES & EXPERIMENTS ===
${activitiesText}

=== KEY VOCABULARY & DEFINITIONS ===
${keyTermsText}

=== CHAPTER SUMMARY ===
${chapter.fullSummary}
`.trim();

    // Rough token count estimate (approx 4 chars per token)
    const tokenEstimate = Math.ceil(fullContextString.length / 4);

    return {
      chapterCode: chapter.code,
      title: chapter.title,
      boardName,
      academicYear: chapter.academicYear,
      classGrade: chapter.classGrade,
      subjectName: chapter.subjectId,
      officialSource: `${chapter.source.authority} - ${chapter.source.bookTitle}`,
      sourceUrl: chapter.source.url,
      fullContextString,
      learningObjectives: chapter.learningObjectives,
      coreConceptsText,
      formulasText,
      activitiesText,
      keyTermsText,
      tokenEstimate
    };
  }
}

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from 'docx';
import { GeneratedQuestionPaper } from '../question-paper/types';
import { GeneratedAnswerKey } from '../answer-key/types';

/** Lightweight worksheet export used by the Daily Practice Plan preview. */
export async function exportDocxFile(content: any, fileName: string): Promise<void> {
  const header = content?.header || {};
  const sections = Array.isArray(content?.sections) ? content.sections : [];
  const children: Paragraph[] = [
    new Paragraph({ text: header.schoolName || 'EduGen AI Worksheet', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: header.examName || 'Practice Worksheet', heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: `Class: ${header.classGrade || ''} | Subject: ${header.subject || ''} | Marks: ${header.maximumMarks || ''}` }),
    new Paragraph({ text: 'Instructions:', heading: HeadingLevel.HEADING_2 }),
    ...(header.generalInstructions || []).map((instruction: string, index: number) => new Paragraph({ text: `${index + 1}. ${instruction}` })),
  ];

  sections.forEach((section: any) => {
    children.push(new Paragraph({ text: section.sectionName || 'Questions', heading: HeadingLevel.HEADING_2 }));
    (section.questions || []).forEach((question: any) => {
      children.push(new Paragraph({ text: `Q${question.questionNumber}. ${question.text} [${question.marks} Marks]` }));
      (question.options || []).forEach((option: string) => children.push(new Paragraph({ text: `   ${option}` })));
    });
  });

  const blob = await Packer.toBlob(new Document({ sections: [{ properties: {}, children }] }));
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export class DocxExporter {
  /**
   * Export Question Paper as formatted MS Word (.docx) document
   */
  static async exportQuestionPaper(paper: GeneratedQuestionPaper): Promise<void> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // School Header
            new Paragraph({
              text: paper.schoolName,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: paper.title, bold: true, size: 28 }),
              ],
              spacing: { after: 120 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `Class: ${paper.classGrade} | Subject: ${paper.subjectName.toUpperCase()} | Academic Year: ${paper.academicYear}`, bold: true, size: 22 }),
              ],
              spacing: { after: 200 }
            }),

            // Meta Info Bar
            new Paragraph({
              children: [
                new TextRun({ text: `Time Allowed: ${paper.durationMinutes} Minutes`, bold: true }),
                new TextRun({ text: '\t\t\t\t\t\t' }),
                new TextRun({ text: `Maximum Marks: ${paper.totalMarks}`, bold: true }),
              ],
              spacing: { after: 200 }
            }),

            // General Instructions
            new Paragraph({
              text: 'General Instructions:',
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...paper.generalInstructions.map(
              (inst, i) =>
                new Paragraph({
                  text: `${i + 1}. ${inst}`,
                  spacing: { after: 60 }
                })
            ),

            // Sections and Questions
            ...paper.sections.flatMap((section) => [
              new Paragraph({
                text: section.name.toUpperCase(),
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 120 }
              }),
              ...section.questions.flatMap((q) => {
                const questionParagraphs: Paragraph[] = [
                  new Paragraph({
                    children: [
                      new TextRun({ text: `Q${q.qNumber}. `, bold: true }),
                      new TextRun({ text: q.questionText }),
                      new TextRun({ text: `  [${q.marks} Mark${q.marks > 1 ? 's' : ''}]`, bold: true, italics: true }),
                    ],
                    spacing: { before: 100, after: 60 }
                  })
                ];

                if (q.options && q.options.length > 0) {
                  q.options.forEach((opt) => {
                    questionParagraphs.push(
                      new Paragraph({
                        text: `   (${opt.key}) ${opt.text}`,
                        spacing: { after: 40 }
                      })
                    );
                  });
                }

                if (q.assertion && q.reason) {
                  questionParagraphs.push(
                    new Paragraph({ text: `   Assertion (A): ${q.assertion}`, spacing: { after: 40 } }),
                    new Paragraph({ text: `   Reason (R): ${q.reason}`, spacing: { after: 40 } })
                  );
                }

                if (q.caseScenario) {
                  questionParagraphs.push(
                    new Paragraph({ children: [new TextRun({ text: `   Case Study: ${q.caseScenario}`, italics: true })], spacing: { after: 60 } })
                  );
                }

                return questionParagraphs;
              })
            ])
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${paper.boardName}_Class${paper.classGrade}_${paper.subjectName}_QuestionPaper.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export Answer Key as formatted MS Word (.docx) document
   */
  static async exportAnswerKey(key: GeneratedAnswerKey): Promise<void> {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `${key.schoolName} - MARKING SCHEME`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 }
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `Answer Key: ${key.paperTitle}`, bold: true, size: 26 }),
              ],
              spacing: { after: 200 }
            }),
            ...key.items.flatMap((item) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `Q${item.qNumber}. [${item.marks} Mark${item.marks > 1 ? 's' : ''}] `, bold: true }),
                  new TextRun({ text: item.questionText, italics: true }),
                ],
                spacing: { before: 180, after: 60 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Answer / Value Point: ', bold: true, color: '0052CC' }),
                  new TextRun({ text: item.finalAnswer }),
                ],
                spacing: { after: 40 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Step Solution / Rubric: ', bold: true }),
                  new TextRun({ text: item.stepByStepSolution }),
                ],
                spacing: { after: 60 }
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Marking Criteria: ', bold: true }),
                  new TextRun({ text: item.markingCriteria, italics: true }),
                ],
                spacing: { after: 120 }
              })
            ])
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${key.boardName}_Class${key.classGrade}_${key.subjectName}_AnswerKey.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

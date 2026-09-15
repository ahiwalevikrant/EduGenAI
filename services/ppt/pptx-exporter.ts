import pptxgen from 'pptxgenjs';
import { PPTDeck, SlideItem, SlideThemeId } from './types';

const THEME_PALETTES: Record<SlideThemeId, { bg: string; text: string; header: string; accent: string; cardBg: string }> = {
  jira_blue: { bg: 'F4F5F7', text: '172B4D', header: '0052CC', accent: '0065FF', cardBg: 'FFFFFF' },
  academic_slate: { bg: '091E42', text: 'FFFFFF', header: '4C9AFF', accent: '00B8D9', cardBg: '172B4D' },
  emerald_modern: { bg: 'F4FDF9', text: '091E42', header: '006644', accent: '36B37E', cardBg: 'FFFFFF' },
  minimal_clean: { bg: 'FFFFFF', text: '172B4D', header: '091E42', accent: '5E6C84', cardBg: 'F4F5F7' },
  dark_navy: { bg: '071426', text: 'F4F5F7', header: '6554C0', accent: 'FFAB00', cardBg: '0E223D' }
};

export class PPTXExporter {
  /**
   * Generates and triggers browser download of an editable .pptx presentation.
   */
  static async exportToPPTX(deck: PPTDeck): Promise<void> {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'EduGen AI Platform';
    pptx.company = 'EduGen AI';
    pptx.subject = `${deck.boardName} Class ${deck.classGrade} ${deck.subjectName} - ${deck.chapterTitle}`;
    pptx.title = deck.title;

    const theme = THEME_PALETTES[deck.themeId] || THEME_PALETTES.jira_blue;

    deck.slides.forEach((slideItem: SlideItem) => {
      const slide = pptx.addSlide();
      slide.background = { color: theme.bg };

      // Slide Header Bar / Top Accent
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 0.15,
        fill: { color: theme.header }
      });

      // Small Board Badge & Slide Number
      slide.addText(`${deck.boardName} • Class ${deck.classGrade} ${deck.subjectName} | Slide ${slideItem.slideNumber} of ${deck.slides.length}`, {
        x: 0.8,
        y: 0.35,
        w: 8.5,
        h: 0.3,
        fontSize: 10,
        color: theme.accent,
        bold: true,
        fontFace: 'Arial'
      });

      // Slide Title
      slide.addText(slideItem.title, {
        x: 0.8,
        y: 0.7,
        w: 11.5,
        h: 0.8,
        fontSize: 24,
        color: theme.header,
        bold: true,
        fontFace: 'Arial'
      });

      // Subtitle if available
      if (slideItem.subtitle) {
        slide.addText(slideItem.subtitle, {
          x: 0.8,
          y: 1.45,
          w: 11.5,
          h: 0.4,
          fontSize: 13,
          color: theme.text,
          italic: true,
          fontFace: 'Arial'
        });
      }

      const hasVisual = !!slideItem.generatedImageUrl;
      const contentWidth = hasVisual ? 6.2 : 11.2;

      // Bullet Points Container
      const bulletItems = slideItem.bulletPoints.map(b => ({
        text: b,
        options: {
          fontSize: 15,
          color: theme.text,
          bullet: { type: 'bullet', color: theme.accent },
          spaceAfter: 10,
          fontFace: 'Arial'
        }
      }));

      slide.addText(bulletItems, {
        x: 0.8,
        y: slideItem.subtitle ? 2.0 : 1.7,
        w: contentWidth,
        h: 4.0,
        align: 'left',
        valign: 'top'
      });

      // Key Formula Callout Box
      if (slideItem.keyFormula) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8,
          y: 5.6,
          w: contentWidth,
          h: 0.8,
          fill: { color: theme.cardBg },
          line: { color: theme.accent, width: 1 }
        });

        slide.addText(`Formula: ${slideItem.keyFormula}`, {
          x: 1.0,
          y: 5.7,
          w: contentWidth - 0.4,
          h: 0.6,
          fontSize: 13,
          bold: true,
          color: theme.header,
          fontFace: 'Courier New'
        });
      }

      // Visual Image or Diagram Box
      if (hasVisual && slideItem.generatedImageUrl) {
        slide.addImage({
          data: slideItem.generatedImageUrl,
          x: 7.4,
          y: 1.8,
          w: 4.8,
          h: 3.8
        });
      } else if (slideItem.visualSuggestion) {
        // Render pedagogical visual note card on right side
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 7.4,
          y: 1.8,
          w: 4.8,
          h: 3.8,
          fill: { color: theme.cardBg },
          line: { color: 'DFE1E6', width: 1 }
        });

        slide.addText('PEDAGOGICAL VISUAL NOTE', {
          x: 7.7,
          y: 2.1,
          w: 4.2,
          h: 0.3,
          fontSize: 10,
          bold: true,
          color: theme.accent,
          fontFace: 'Arial'
        });

        slide.addText(slideItem.visualSuggestion, {
          x: 7.7,
          y: 2.5,
          w: 4.2,
          h: 2.8,
          fontSize: 12,
          color: theme.text,
          italic: true,
          fontFace: 'Arial'
        });
      }

      // Speaker Notes
      if (slideItem.speakerNotes) {
        slide.addNotes(slideItem.speakerNotes);
      }
    });

    const fileName = `${deck.boardName}_Class${deck.classGrade}_${deck.subjectName}_${deck.chapterTitle.replace(/\s+/g, '_')}.pptx`;
    await pptx.writeFile({ fileName });
  }
}

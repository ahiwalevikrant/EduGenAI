import { EducationalDiagram, DiagramGenerator } from './diagram-generator';

export interface ImageGenerationRequest {
  prompt: string;
  topic: string;
  title: string;
  providerApiKey?: string;
  providerBaseUrl?: string;
}

export interface GeneratedImageResult {
  type: 'image_url' | 'svg_diagram';
  url?: string;
  diagram?: EducationalDiagram;
  prompt: string;
}

export class ImageService {
  /**
   * Generates either an AI diagram via image API or synthesized educational SVG diagram.
   */
  static async generateVisual(request: ImageGenerationRequest): Promise<GeneratedImageResult> {
    // If user provided an OpenAI API key, attempt DALL-E 3 image generation
    if (request.providerApiKey && request.providerApiKey.startsWith('sk-')) {
      try {
        const res = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${request.providerApiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: `Educational textbook illustration: ${request.prompt}. Clear diagram, scientific accuracy, clean white background, high contrast labels.`,
            n: 1,
            size: '1024x1024',
            quality: 'standard'
          })
        });

        if (res.ok) {
          const data = await res.json();
          const imageUrl = data.data?.[0]?.url;
          if (imageUrl) {
            return {
              type: 'image_url',
              url: imageUrl,
              prompt: request.prompt
            };
          }
        }
      } catch (e) {
        console.warn('DALL-E generation fallback to SVG diagram:', e);
      }
    }

    // High quality vector educational SVG diagram
    const diagram = DiagramGenerator.getPrebuiltOrGeneratedSVG(request.topic, request.title);
    return {
      type: 'svg_diagram',
      diagram,
      prompt: request.prompt
    };
  }
}

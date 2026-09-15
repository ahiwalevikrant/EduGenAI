export class JsonCleaner {
  /**
   * Safely extract and parse JSON from model responses which may contain
   * markdown code blocks, conversational prefixes, or trailing characters.
   */
  static cleanAndParse<T>(rawText: string): T {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Empty response received from AI model.');
    }

    let cleaned = rawText.trim();

    // Remove markdown code blocks if present
    if (cleaned.includes('```json')) {
      const match = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        cleaned = match[1].trim();
      }
    } else if (cleaned.includes('```')) {
      const match = cleaned.match(/```\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        cleaned = match[1].trim();
      }
    }

    // If still not starting with { or [, search for first opening bracket and matching closing
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    
    let startIndex = -1;
    let isObject = false;

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIndex = firstBrace;
      isObject = true;
    } else if (firstBracket !== -1) {
      startIndex = firstBracket;
      isObject = false;
    }

    if (startIndex !== -1) {
      const lastIndex = isObject ? cleaned.lastIndexOf('}') : cleaned.lastIndexOf(']');
      if (lastIndex !== -1 && lastIndex > startIndex) {
        cleaned = cleaned.substring(startIndex, lastIndex + 1);
      }
    }

    try {
      return JSON.parse(cleaned) as T;
    } catch (err: any) {
      console.error('Failed to parse raw JSON:', rawText);
      throw new Error(`Invalid JSON returned by AI model: ${err.message}. Response was:\n${rawText.slice(0, 300)}...`);
    }
  }
}

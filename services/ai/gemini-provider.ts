import { AIProvider, AIProviderConfig, ConnectionTestResult, GenerationOptions } from './ai-provider.interface';
import { JsonCleaner } from './json-cleaner';

export class GeminiProvider implements AIProvider {
  readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  private getUrl(model: string, stream = false): string {
    const base = this.config.baseUrl?.trim() || 'https://generativelanguage.googleapis.com/v1beta';
    const action = stream ? 'streamGenerateContent' : 'generateContent';
    return `${base}/models/${model}:${action}?key=${this.config.apiKey.trim()}`;
  }

  async listModels(): Promise<string[]> {
    if (!this.config.apiKey?.trim()) throw new Error('Google Gemini API key is missing.');

    const base = this.config.baseUrl?.trim() || 'https://generativelanguage.googleapis.com/v1beta';
    const response = await fetch(`${base}/models?key=${this.config.apiKey.trim()}`);
    if (!response.ok) throw new Error(`Gemini model list error (${response.status}): ${await response.text()}`);

    const payload = await response.json();
    return (Array.isArray(payload.models) ? payload.models : [])
      .filter((model: any) => model?.supportedGenerationMethods?.includes('generateContent'))
      .map((model: any) => String(model.name || '').replace(/^models\//, ''))
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      if (!this.config.apiKey?.trim()) {
        return { success: false, message: 'Google Gemini API key is missing.' };
      }

      const model = this.config.defaultModel || 'gemini-1.5-flash';
      const url = this.getUrl(model);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK' }] }],
          generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
        })
      });

      const latencyMs = Date.now() - start;

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          message: `Gemini Error (${response.status}): ${errorText}`,
          latencyMs
        };
      }

      return {
        success: true,
        message: `Successfully connected to Gemini API with model ${model}.`,
        latencyMs,
        modelUsed: model
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to connect to Google Gemini API.',
        latencyMs: Date.now() - start
      };
    }
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<string> {
    const model = options?.model || this.config.defaultModel || 'gemini-1.5-flash';
    const temperature = options?.temperature ?? this.config.temperature ?? 0.4;
    const maxTokens = options?.maxTokens ?? this.config.maxTokens ?? 3500;

    const url = this.getUrl(model);

    const contents: any[] = [];
    if (options?.systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: `System Instruction: ${options.systemPrompt}` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I will follow these pedagogical curriculum instructions strictly.' }]
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const generationConfig: any = {
      temperature,
      maxOutputTokens: maxTokens
    };

    if (options?.jsonMode) {
      generationConfig.responseMimeType = 'application/json';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Gemini API Error ${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<string> {
    // For reliable cross-browser Gemini JSON streaming, we can execute generate and chunk or stream
    const result = await this.generate(prompt, options);
    onChunk(result);
    return result;
  }

  async generateStructured<T>(prompt: string, options?: GenerationOptions): Promise<T> {
    const raw = await this.generate(prompt, { ...options, jsonMode: true });
    return JsonCleaner.cleanAndParse<T>(raw);
  }
}

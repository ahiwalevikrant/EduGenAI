import { AIProvider, AIProviderConfig, ConnectionTestResult, GenerationOptions } from './ai-provider.interface';
import { JsonCleaner } from './json-cleaner';

export class GroqProvider implements AIProvider {
  readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  private getBaseUrl(): string {
    return this.config.baseUrl || 'https://api.groq.com/openai/v1';
  }

  async listModels(): Promise<string[]> {
    if (!this.config.apiKey?.trim()) {
      throw new Error('Groq API key is missing.');
    }

    const response = await fetch(`${this.getBaseUrl().replace(/\/$/, '')}/models`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey.trim()}` }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Groq model list error (${response.status}): ${error.error?.message || response.statusText}`);
    }

    const payload = await response.json();
    return (Array.isArray(payload.data) ? payload.data : [])
      .map((model: any) => model?.id)
      .filter((id: unknown): id is string => typeof id === 'string')
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      if (!this.config.apiKey) {
        return { success: false, message: 'Groq API Key is missing.' };
      }

      const res = await fetch(`${this.getBaseUrl()}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.defaultModel || 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: 'Respond with "OK" in 1 word.' }],
          max_tokens: 5,
          temperature: 0.1
        })
      });

      const latencyMs = Date.now() - start;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          success: false,
          message: `Groq Error (${res.status}): ${errorData.error?.message || res.statusText}`,
          latencyMs
        };
      }

      const data = await res.json();
      return {
        success: true,
        message: `Connected to Groq LPU engine (${data.model || this.config.defaultModel}) in ${latencyMs}ms`,
        latencyMs,
        modelUsed: data.model || this.config.defaultModel
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Network failure connecting to Groq: ${err.message || 'Unknown error'}`,
        latencyMs: Date.now() - start
      };
    }
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<string> {
    const model = options?.model || this.config.defaultModel || 'llama-3.3-70b-versatile';
    const temperature = options?.temperature ?? this.config.temperature ?? 0.3;
    const maxTokens = options?.maxTokens ?? this.config.maxTokens ?? 4096;

    const messages: { role: string; content: string }[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const payload: any = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens
    };

    if (options?.jsonMode) {
      payload.response_format = { type: 'json_object' };
    }

    const res = await fetch(`${this.getBaseUrl()}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Groq API Error (${res.status}): ${err.error?.message || res.statusText}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<string> {
    const fullText = await this.generate(prompt, options);
    onChunk(fullText);
    return fullText;
  }

  async generateStructured<T>(prompt: string, options?: GenerationOptions): Promise<T> {
    const raw = await this.generate(prompt, {
      ...options,
      jsonMode: true,
      systemPrompt: (options?.systemPrompt || '') + '\nYou MUST respond ONLY with valid JSON conforming to the requested schema. Do not output markdown code blocks or explanations.'
    });

    return JsonCleaner.cleanAndParse<T>(raw);
  }
}

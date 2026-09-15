import { AIProvider, AIProviderConfig, ConnectionTestResult, GenerationOptions } from './ai-provider.interface';
import { JsonCleaner } from './json-cleaner';

export class OpenRouterProvider implements AIProvider {
  readonly config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  private getEndpoint(): string {
    return this.config.baseUrl?.trim() || 'https://openrouter.ai/api/v1/chat/completions';
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey.trim()}`,
      'HTTP-Referer': 'https://edugen-ai.education',
      'X-Title': 'EduGen AI Teaching Platform'
    };
  }

  async testConnection(): Promise<ConnectionTestResult> {
    const start = Date.now();
    try {
      if (!this.config.apiKey?.trim()) {
        return { success: false, message: 'OpenRouter API key is missing.' };
      }

      const response = await fetch(this.getEndpoint(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: this.config.defaultModel,
          messages: [{ role: 'user', content: 'Say OK' }],
          max_tokens: 10
        })
      });

      const latencyMs = Date.now() - start;

      if (!response.ok) {
        const errorBody = await response.text();
        return {
          success: false,
          message: `OpenRouter Error (${response.status}): ${errorBody}`,
          latencyMs
        };
      }

      return {
        success: true,
        message: `Successfully connected to OpenRouter with model ${this.config.defaultModel}.`,
        latencyMs,
        modelUsed: this.config.defaultModel
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Failed to connect to OpenRouter.',
        latencyMs: Date.now() - start
      };
    }
  }

  async generate(prompt: string, options?: GenerationOptions): Promise<string> {
    const model = options?.model || this.config.defaultModel;
    const temperature = options?.temperature ?? this.config.temperature ?? 0.4;
    const maxTokens = options?.maxTokens ?? this.config.maxTokens ?? 3500;

    const messages: any[] = [];
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

    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[OpenRouter Error ${response.status}]: ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async streamGenerate(
    prompt: string,
    onChunk: (chunk: string) => void,
    options?: GenerationOptions
  ): Promise<string> {
    const model = options?.model || this.config.defaultModel;
    const temperature = options?.temperature ?? this.config.temperature ?? 0.4;
    const maxTokens = options?.maxTokens ?? this.config.maxTokens ?? 3500;

    const messages: any[] = [];
    if (options?.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetch(this.getEndpoint(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: true
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[OpenRouter Stream Error]: ${err}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      return this.generate(prompt, options);
    }

    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed === 'data: [DONE]') continue;
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              onChunk(delta);
            }
          } catch (_) {}
        }
      }
    }

    return fullText;
  }

  async generateStructured<T>(prompt: string, options?: GenerationOptions): Promise<T> {
    const raw = await this.generate(prompt, { ...options, jsonMode: true });
    return JsonCleaner.cleanAndParse<T>(raw);
  }
}

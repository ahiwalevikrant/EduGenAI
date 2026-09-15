import { AIProvider, AIProviderConfig } from './ai-provider.interface';
import { OpenRouterProvider } from './openrouter-provider';
import { GroqProvider } from './groq-provider';

export const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'openrouter-default',
    name: 'OpenRouter (Multi-Model Hub)',
    type: 'openrouter',
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    availableModels: [
      'anthropic/claude-3.5-sonnet',
      'google/gemini-2.0-flash-exp:free',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3.3-70b-instruct',
      'deepseek/deepseek-chat',
      'deepseek/deepseek-r1',
      'openai/gpt-4o',
      'openai/gpt-4o-mini'
    ],
    temperature: 0.3,
    maxTokens: 4000,
    isDefault: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    lastStatus: 'untested'
  },
  {
    id: 'groq-default',
    name: 'Groq Cloud (Ultra-Fast LPU)',
    type: 'groq',
    apiKey: '',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    availableModels: [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'deepseek-r1-distill-llama-70b',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ],
    temperature: 0.3,
    maxTokens: 4000,
    isDefault: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    lastStatus: 'untested'
  }
];

export class AIService {
  static createProvider(config: AIProviderConfig): AIProvider {
    switch (config.type) {
      case 'groq':
        return new GroqProvider(config);
      case 'openrouter':
      default:
        return new OpenRouterProvider(config);
    }
  }

  static getActiveProvider(providers: AIProviderConfig[]): AIProviderConfig | undefined {
    return providers.find(p => p.isDefault) || providers.find(p => p.isActive) || providers[0];
  }
}


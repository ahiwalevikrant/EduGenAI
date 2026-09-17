export type ProviderType = 
  | 'openrouter'
  | 'groq';

export interface AIProviderConfig {
  id: string;
  name: string;
  type: ProviderType;
  apiKey: string;
  baseUrl?: string;
  defaultModel: string;
  availableModels: string[];
  temperature: number;
  maxTokens: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  lastTestedAt?: string;
  lastStatus?: 'connected' | 'error' | 'untested';
  errorMessage?: string;
}

export interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  systemPrompt?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  modelUsed?: string;
}

export interface AIProvider {
  readonly config: AIProviderConfig;
  testConnection(): Promise<ConnectionTestResult>;
  listModels(): Promise<string[]>;
  generate(prompt: string, options?: GenerationOptions): Promise<string>;
  streamGenerate(
    prompt: string, 
    onChunk: (chunk: string) => void, 
    options?: GenerationOptions
  ): Promise<string>;
  generateStructured<T>(prompt: string, options?: GenerationOptions): Promise<T>;
}

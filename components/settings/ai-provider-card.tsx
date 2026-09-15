'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Key, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Trash2, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { AIProviderConfig } from '../../services/ai/ai-provider.interface';
import { AIService } from '../../services/ai/ai-service';

interface Props {
  provider: AIProviderConfig;
  isDefault: boolean;
  onUpdate: (updates: Partial<AIProviderConfig>) => void;
  onSetDefault: () => void;
  onDelete?: () => void;
}

export function AIProviderCard({ provider, isDefault, onUpdate, onSetDefault, onDelete }: Props) {
  const [apiKey, setApiKey] = useState(provider.apiKey);
  const [baseUrl, setBaseUrl] = useState(provider.baseUrl || '');
  const [defaultModel, setDefaultModel] = useState(provider.defaultModel);
  const [temperature, setTemperature] = useState(provider.temperature);
  const [maxTokens, setMaxTokens] = useState(provider.maxTokens);
  const [showKey, setShowKey] = useState(false);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const tempConfig: AIProviderConfig = {
      ...provider,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      defaultModel: defaultModel.trim(),
      temperature,
      maxTokens
    };

    try {
      const adapter = AIService.createProvider(tempConfig);
      const res = await adapter.testConnection();
      setTestResult(res);
      onUpdate({
        apiKey: apiKey.trim(),
        baseUrl: baseUrl.trim(),
        defaultModel: defaultModel.trim(),
        lastStatus: res.success ? 'connected' : 'error',
        lastTestedAt: new Date().toISOString()
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    onUpdate({
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      defaultModel: defaultModel.trim(),
      temperature,
      maxTokens
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className={`bg-white dark:bg-dark-surface border rounded-lg shadow-jira-card overflow-hidden transition-all ${
      isDefault ? 'border-jira-primary ring-2 ring-jira-primary/30' : 'border-jira-border dark:border-dark-border hover:border-jira-border-dark'
    }`}>
      {/* Provider Header (Jira Style) */}
      <div className="p-4 md:p-5 border-b border-jira-border dark:border-dark-border bg-jira-bg/40 dark:bg-dark-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-md bg-jira-selected dark:bg-jira-primary/20 text-jira-primary flex items-center justify-center font-bold text-sm border border-jira-primary/30 shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-jira-text dark:text-dark-text">{provider.name}</h3>
              {isDefault && (
                <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded bg-jira-primary text-white">
                  Default Engine
                </span>
              )}
            </div>
            <span className="text-xs text-jira-subtext dark:text-dark-subtext font-mono mt-0.5 block">
              Type: {provider.type.toUpperCase()} • Endpoint: {provider.baseUrl ? new URL(provider.baseUrl).hostname : 'Default'}
            </span>
          </div>
        </div>

        {/* Connection Status Pill */}
        <div className="flex items-center space-x-2">
          {testResult ? (
            <span className={`text-xs md:text-sm px-3 py-1 rounded-md font-bold flex items-center space-x-1.5 ${
              testResult.success 
                ? 'bg-jira-green-bg dark:bg-jira-green/20 text-jira-green-text dark:text-jira-green border border-jira-green/30' 
                : 'bg-jira-red-bg dark:bg-jira-red/20 text-jira-red-text dark:text-jira-red border border-jira-red/30'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 text-jira-green" /> : <AlertCircle className="w-4 h-4 text-jira-red" />}
              <span>{testResult.success ? `Connected (${testResult.latencyMs}ms)` : 'Failed'}</span>
            </span>
          ) : provider.lastStatus === 'connected' ? (
            <span className="text-xs md:text-sm px-3 py-1 rounded-md font-bold bg-jira-green-bg dark:bg-jira-green/20 text-jira-green-text dark:text-jira-green border border-jira-green/30 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-jira-green" />
              <span>Connected</span>
            </span>
          ) : (
            <span className="text-xs md:text-sm px-3 py-1 rounded-md font-semibold bg-jira-bg dark:bg-dark-card text-jira-subtext dark:text-dark-subtext border border-jira-border dark:border-dark-border">
              Untested
            </span>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-5 space-y-4">
        {/* Test Result Message Box if present */}
        {testResult && (
          <div className={`p-3 rounded-md text-xs md:text-sm leading-relaxed ${
            testResult.success ? 'bg-jira-green-bg dark:bg-jira-green/20 text-jira-green-text dark:text-jira-green' : 'bg-jira-red-bg dark:bg-jira-red/20 text-jira-red-text dark:text-jira-red'
          }`}>
            <span className="font-bold">{testResult.success ? 'Success: ' : 'Error: '}</span>
            <span>{testResult.message}</span>
          </div>
        )}

        {/* API Key */}
        <div>
          <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
            API Key
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-jira-muted dark:text-dark-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider.type === 'groq' ? 'gsk_... (Groq API Key)' : 'sk-or-... (OpenRouter API Key)'}
              className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark focus:border-jira-primary rounded-md px-3.5 py-2 pl-9 pr-9 text-sm font-mono text-jira-text dark:text-dark-text outline-none shadow-xs transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="p-1 text-jira-muted dark:text-dark-muted hover:text-jira-text dark:hover:text-dark-text absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider mb-1.5">
            Default Model Identifier
          </label>
          <div className="relative">
            <select
              value={defaultModel}
              onChange={(e) => setDefaultModel(e.target.value)}
              className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border hover:border-jira-border-dark focus:border-jira-primary rounded-md px-3.5 py-2 text-sm font-mono text-jira-text dark:text-dark-text outline-none shadow-xs transition-colors cursor-pointer"
            >
              {provider.availableModels.map((m) => (
                <option key={m} value={m} className="dark:bg-dark-surface">
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Temperature & Max Tokens */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-jira-border dark:border-dark-border">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider">
                Temperature ({temperature})
              </label>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-jira-primary cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-jira-subtext dark:text-dark-subtext uppercase tracking-wider">
                Max Output Tokens
              </label>
            </div>
            <input
              type="number"
              min={500}
              max={8000}
              step={500}
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 4000)}
              className="w-full bg-white dark:bg-dark-card border border-jira-border dark:border-dark-border rounded-md px-3 py-1.5 text-sm font-mono text-jira-text dark:text-dark-text"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-jira-bg/60 dark:bg-dark-card border-t border-jira-border dark:border-dark-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          {!isDefault && (
            <button
              onClick={onSetDefault}
              className="text-xs md:text-sm font-bold text-jira-subtext dark:text-dark-subtext hover:text-jira-primary transition-colors cursor-pointer"
            >
              Set as Default
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs md:text-sm text-jira-red font-semibold hover:underline cursor-pointer"
            >
              Delete
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center space-x-1.5 bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border hover:bg-jira-hover dark:hover:bg-dark-hover px-3.5 py-2 rounded-md text-xs md:text-sm font-bold text-jira-text dark:text-dark-text transition-colors shadow-xs cursor-pointer"
          >
            {isTesting ? <RefreshCw className="w-4 h-4 animate-spin text-jira-primary" /> : <Sparkles className="w-4 h-4 text-jira-primary" />}
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center space-x-1.5 bg-jira-primary hover:bg-jira-primary-hover text-white px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{saveSuccess ? 'Saved!' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

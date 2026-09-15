'use client';

import React from 'react';
import { 
  Settings, 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  Layers,
  Sun,
  Moon,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useSettingsStore } from '../../store/use-settings-store';
import { AIProviderCard } from '../../components/settings/ai-provider-card';
import { SecurityNoticeBanner } from '../../components/settings/security-notice';

export default function SettingsPage() {
  const { 
    providers, 
    activeProviderId, 
    updateProvider, 
    setDefaultProvider,
    theme,
    setTheme
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-dark-surface border border-jira-border dark:border-dark-border rounded-lg p-5 md:p-6 shadow-jira-card flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center space-x-2.5">
            <Settings className="w-6 h-6 text-jira-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-jira-text dark:text-dark-text">
              AI Provider Configuration & App Preferences
            </h1>
          </div>
          <p className="text-xs md:text-sm text-jira-subtext dark:text-dark-subtext mt-1">
            Configure OpenRouter (Multi-Model) and Groq Cloud (Ultra-Fast LPU) credentials and appearance theme.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-jira-bg dark:bg-dark-card border border-jira-border dark:border-dark-border p-1 rounded-lg">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white dark:bg-dark-surface text-jira-text dark:text-dark-text shadow-xs'
                  : 'text-jira-subtext dark:text-dark-subtext hover:text-jira-text dark:hover:text-dark-text'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-jira-primary text-white shadow-xs'
                  : 'text-jira-subtext dark:text-dark-subtext hover:text-jira-text dark:hover:text-dark-text'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Notice Banner */}
      <SecurityNoticeBanner />

      {/* AI Providers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-jira-primary" />
            <h2 className="text-xs md:text-sm font-bold text-jira-muted dark:text-dark-muted uppercase tracking-wider">
              Supported AI Engines (OpenRouter & Groq)
            </h2>
          </div>
          <span className="text-xs md:text-sm text-jira-subtext dark:text-dark-subtext">
            Active: <strong className="text-jira-primary">{providers.find(p => p.id === activeProviderId)?.name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {providers.map((provider) => (
            <AIProviderCard
              key={provider.id}
              provider={provider}
              isDefault={provider.id === activeProviderId}
              onUpdate={(updates) => updateProvider(provider.id, updates)}
              onSetDefault={() => setDefaultProvider(provider.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

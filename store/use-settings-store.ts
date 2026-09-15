'use client';

import { useState, useEffect } from 'react';
import { AIProviderConfig } from '../services/ai/ai-provider.interface';
import { DEFAULT_PROVIDERS } from '../services/ai/ai-service';

export function useSettingsStore() {
  const [providers, setProviders] = useState<AIProviderConfig[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edugen_ai_providers');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (_) {}
    }
    return DEFAULT_PROVIDERS;
  });

  const [activeProviderId, setActiveProviderId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edugen_active_provider_id');
        if (saved) return saved;
      } catch (_) {}
    }
    return 'openrouter-default';
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('edugen_theme');
        if (saved === 'dark' || saved === 'light') return saved;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch (_) {}
    }
    return 'light';
  });

  const [dismissedSecurityNotice, setDismissedSecurityNotice] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edugen_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edugen_ai_providers', JSON.stringify(providers));
    }
  }, [providers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('edugen_active_provider_id', activeProviderId);
    }
  }, [activeProviderId]);

  const activeProvider = providers.find(p => p.id === activeProviderId) || providers[0];

  const updateProvider = (id: string, updates: Partial<AIProviderConfig>) => {
    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    }));
  };

  const setDefaultProvider = (id: string) => {
    setActiveProviderId(id);
    setProviders(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
  };

  const addProvider = (config: AIProviderConfig) => {
    setProviders(prev => [...prev, config]);
  };

  const deleteProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
    if (activeProviderId === id) {
      const remaining = providers.filter(p => p.id !== id);
      if (remaining.length > 0) {
        setActiveProviderId(remaining[0].id);
      }
    }
  };

  return {
    providers,
    activeProvider,
    activeProviderId,
    updateProvider,
    setDefaultProvider,
    addProvider,
    deleteProvider,
    dismissedSecurityNotice,
    setDismissedSecurityNotice,
    theme,
    setTheme,
    toggleTheme
  };
}

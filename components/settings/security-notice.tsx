'use client';

import React from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';
import { useSettingsStore } from '../../store/use-settings-store';

export function SecurityNoticeBanner() {
  const { dismissedSecurityNotice, setDismissedSecurityNotice } = useSettingsStore();

  if (dismissedSecurityNotice) return null;

  return (
    <div className="bg-jira-yellow-bg dark:bg-amber-950/40 border border-jira-yellow/40 dark:border-amber-700/50 rounded-lg p-4 text-xs text-jira-yellow-text dark:text-amber-200 shadow-sm mb-6 relative transition-colors">
      <div className="flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-jira-yellow dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 pr-6">
          <h4 className="font-bold text-xs uppercase tracking-wider text-jira-text dark:text-amber-200">
            Security Notice: Direct Client-Side API Keys (Browser Storage)
          </h4>
          <p className="leading-relaxed text-jira-text dark:text-amber-300/90">
            For this educator workspace, your API keys (OpenRouter, Groq Cloud) are stored locally in your browser&apos;s <code className="font-mono bg-white dark:bg-dark-card px-1 py-0.5 rounded border border-jira-yellow/40 dark:border-amber-700/50 text-[11px]">localStorage</code> and transmitted directly to the provider endpoints over encrypted HTTPS.
          </p>
          <p className="leading-relaxed text-jira-subtext dark:text-amber-400/80 pt-1">
            <strong>Production Recommendation:</strong> In enterprise production school deployments, API keys are proxied via a secure serverless backend with rate-limiting, authentication, and encrypted KMS vaults.
          </p>
        </div>
      </div>

      <button
        onClick={() => setDismissedSecurityNotice(true)}
        className="absolute top-3 right-3 text-jira-subtext dark:text-amber-300 hover:text-jira-text dark:hover:text-white p-1 cursor-pointer"
        title="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

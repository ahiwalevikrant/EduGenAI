'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Key, 
  Mail, 
  Lock, 
  GraduationCap, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/use-auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin, isAuthenticated } = useAuthStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username or email');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
    router.push('/');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Notion-style Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[#5645d4] text-white flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-[#f6f5f4]">
            Welcome to EduGen AI
          </h1>
          <p className="text-sm text-[#5d5b54] dark:text-[#a4a097]">
            Curriculum-grounded AI teaching workspace for educators
          </p>
        </div>

        {/* Quick Demo 1-Click Login Card */}
        <div className="bg-[#fef7d6] dark:bg-[#1a2a52] border border-[#f9e79f] dark:border-[#243769] rounded-lg p-4 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#dd5b00] dark:text-[#f5d75e] uppercase tracking-wider">
            <Key className="w-4 h-4" />
            <span>1-Click Demo Credentials</span>
          </div>
          <div className="text-xs text-[#37352f] dark:text-[#f6f5f4] flex flex-wrap items-center justify-between gap-2">
            <span>Username: <strong className="font-mono bg-white/80 dark:bg-black/30 px-1.5 py-0.5 rounded text-[#1a1a1a] dark:text-white">admin</strong></span>
            <span>Password: <strong className="font-mono bg-white/80 dark:bg-black/30 px-1.5 py-0.5 rounded text-[#1a1a1a] dark:text-white">admin</strong></span>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full bg-[#5645d4] hover:bg-[#4534b3] text-white font-medium text-sm py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Log In as Demo Admin (admin / admin)</span>
          </button>
        </div>

        {/* Main Login Form Card */}
        <div className="bg-white dark:bg-[#0f1c3d] border border-[#e5e3df] dark:border-[#243769] rounded-lg p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-md bg-[#fde0ec] dark:bg-red-950/60 border border-[#e03131]/30 text-[#e03131] dark:text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
                Username or School Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or teacher@school.edu"
                  className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md pl-9 pr-3.5 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md pl-9 pr-3.5 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] hover:bg-black dark:bg-[#5645d4] dark:hover:bg-[#4534b3] text-white font-medium text-sm py-2.5 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <span>{loading ? 'Logging in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#e5e3df] dark:border-[#243769] text-center text-xs text-[#5d5b54] dark:text-[#a4a097]">
            Don't have an educator account?{' '}
            <Link href="/signup" className="text-[#5645d4] dark:text-[#7b3ff2] font-semibold hover:underline">
              Create one for free
            </Link>
          </div>
        </div>

        {/* Official Curriculum Badge */}
        <div className="text-center text-xs text-[#787671] dark:text-[#a4a097] flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-[#1aae39]" />
          <span>Grounded strictly in NCERT, Balbharati & CISCE curricula</span>
        </div>
      </div>
    </div>
  );
}

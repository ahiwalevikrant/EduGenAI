'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  Building2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/use-auth-store';
import { GoogleSignInButton } from '../../components/auth/google-sign-in-button';

export default function SignupPage() {
  const router = useRouter();
  const { signup, signInWithGoogle } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [school, setSchool] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signup(name, email, school);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[#5645d4] text-white flex items-center justify-center mx-auto shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a1a1a] dark:text-[#f6f5f4]">
            Create Educator Account
          </h1>
          <p className="text-sm text-[#5d5b54] dark:text-[#a4a097]">
            Start generating board-aligned Question Papers, DPPs, and PPTs
          </p>
        </div>

        {/* Signup Form Card */}
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
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md pl-9 pr-3.5 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
                School or Academy Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. Delhi Public School, R.K. Puram"
                  className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md pl-9 pr-3.5 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#787671] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                  className="w-full bg-white dark:bg-[#16254c] border border-[#c8c4be] dark:border-[#243769] focus:border-[#5645d4] rounded-md pl-9 pr-3.5 py-2 text-sm text-[#1a1a1a] dark:text-[#f6f5f4] outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5d5b54] dark:text-[#a4a097] uppercase tracking-wider mb-1.5">
                Create Password
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
              className="w-full bg-[#5645d4] hover:bg-[#4534b3] text-white font-medium text-sm py-2.5 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Creating account...' : 'Create Free Account'}</span>
            </button>
          </form>

          <div className="flex items-center gap-3 text-xs text-[#787671] dark:text-[#a4a097]">
            <div className="h-px flex-1 bg-[#e5e3df] dark:bg-[#243769]" />
            <span>OR</span>
            <div className="h-px flex-1 bg-[#e5e3df] dark:bg-[#243769]" />
          </div>

          <GoogleSignInButton
            onSuccess={(profile) => {
              setError(null);
              signInWithGoogle(profile);
              router.push('/');
            }}
            onError={setError}
          />

          <div className="pt-4 border-t border-[#e5e3df] dark:border-[#243769] text-center text-xs text-[#5d5b54] dark:text-[#a4a097]">
            Already have an educator account?{' '}
            <Link href="/login" className="text-[#5645d4] dark:text-[#7b3ff2] font-semibold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

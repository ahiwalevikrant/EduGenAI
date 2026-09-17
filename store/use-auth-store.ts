'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  school: string;
  avatarUrl?: string;
  initials: string;
}

export interface GoogleUserProfile {
  sub: string;
  name?: string;
  email: string;
  picture?: string;
}

const DEMO_ADMIN_USER: UserProfile = {
  id: 'usr_admin_01',
  name: 'Admin Educator',
  email: 'admin@edugen.ai',
  role: 'Master Teacher & Curriculum Lead',
  school: 'Delhi Public School (CBSE Affiliated)',
  initials: 'AD'
};

const STORAGE_KEY = 'edugen_auth_user';
const AUTH_STATUS_KEY = 'edugen_auth_is_authenticated';

export function useAuthStore() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (_) {}
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(AUTH_STATUS_KEY);
        if (saved !== null) {
          return saved === 'true';
        }
      } catch (_) {}
    }
    return false;
  });

  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Listen for storage updates across tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        const savedAuth = localStorage.getItem(AUTH_STATUS_KEY);
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
        setIsAuthenticated(savedAuth === 'true');
      } catch (_) {}
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('edugen_auth_change', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('edugen_auth_change', handleStorageChange);
    };
  }, []);

  const saveState = (newUser: UserProfile | null, auth: boolean) => {
    setUser(newUser);
    setIsAuthenticated(auth);
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      localStorage.setItem(AUTH_STATUS_KEY, String(auth));
      window.dispatchEvent(new Event('edugen_auth_change'));
    }
  };

  const login = async (usernameOrEmail: string, password?: string): Promise<boolean> => {
    const isDemo = usernameOrEmail.toLowerCase().includes('admin');
    const name = isDemo ? 'Admin Educator' : usernameOrEmail.split('@')[0] || 'Teacher';
    const initials = name.slice(0, 2).toUpperCase();

    const loggedUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: isDemo ? 'Admin Educator' : name,
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@edugen.ai`,
      role: isDemo ? 'Master Teacher & Curriculum Lead' : 'Senior Educator',
      school: 'Kendriya Vidyalaya / CBSE Institution',
      initials
    };

    saveState(loggedUser, true);
    return true;
  };

  const demoLogin = () => {
    saveState(DEMO_ADMIN_USER, true);
  };

  const signup = async (name: string, email: string, school: string): Promise<boolean> => {
    const initials = (name || 'Educator')
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ED';

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || 'New Educator',
      email: email || 'educator@school.edu',
      role: 'Faculty Educator',
      school: school || 'CBSE / State Board School',
      initials
    };

    saveState(newUser, true);
    return true;
  };

  const signInWithGoogle = (googleUser: GoogleUserProfile) => {
    const name = googleUser.name?.trim() || googleUser.email.split('@')[0] || 'Educator';
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ED';

    saveState({
      id: `google_${googleUser.sub}`,
      name,
      email: googleUser.email,
      role: 'Faculty Educator',
      school: 'Google-connected educator account',
      avatarUrl: googleUser.picture,
      initials
    }, true);
  };

  const logout = () => {
    saveState(null, false);
  };

  return {
    user,
    isAuthenticated,
    isReady,
    login,
    demoLogin,
    signup,
    signInWithGoogle,
    logout
  };
}

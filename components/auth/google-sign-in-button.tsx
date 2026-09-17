'use client';

import { useEffect, useRef, useState } from 'react';
import type { GoogleUserProfile } from '../../store/use-auth-store';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (profile: GoogleUserProfile) => void;
  onError: (message: string) => void;
}

const GOOGLE_SCRIPT_ID = 'google-identity-services';

function decodeCredential(credential: string): GoogleUserProfile | null {
  try {
    const payload = credential.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    if (!decoded.sub || !decoded.email || decoded.email_verified === false) return null;

    return {
      sub: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    };
  } catch {
    return null;
  }
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const clientId = process.env.GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) {
      setIsLoading(false);
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => {
          const profile = credential ? decodeCredential(credential) : null;
          if (!profile) {
            onError('Google could not verify this account. Please try again.');
            return;
          }
          onSuccess(profile);
        }
      });
      buttonRef.current.replaceChildren();
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320
      });
      setIsLoading(false);
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (window.google) renderGoogleButton();
      else existingScript.addEventListener('load', renderGoogleButton, { once: true });
      return () => existingScript.removeEventListener('load', renderGoogleButton);
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = renderGoogleButton;
    script.onerror = () => {
      setIsLoading(false);
      onError('Google sign-in could not be loaded. Please check your connection and try again.');
    };
    document.head.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [clientId, onError, onSuccess]);

  if (!clientId) return null;

  return (
    <div className="flex justify-center min-h-10" aria-label="Continue with Google">
      {isLoading && <span className="text-xs text-[#787671] dark:text-[#a4a097]">Loading Google sign-in…</span>}
      <div ref={buttonRef} className={isLoading ? 'hidden' : undefined} />
    </div>
  );
}

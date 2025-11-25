// =============================================
// FILE: src/components/AuthCallback.tsx
// Handles redirect after magic link click
// =============================================

import React, { useEffect, useState } from 'react';
import { supabase, db } from '../utils/supabase';

interface AuthCallbackProps {
  onAuthSuccess: (userId: string, hasProfile: boolean) => void;
}

export function AuthCallback({ onAuthSuccess }: AuthCallbackProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          // Check if user has a profile
          const { profile } = await db.getProfile(session.user.id);

          setStatus('success');
          
          // Navigate to profile creation or events page
          onAuthSuccess(session.user.id, !!profile);
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [onAuthSuccess]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg">Signing you in...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-lg">Success! Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✕</span>
            </div>
            <p className="text-lg text-red-600">Authentication failed</p>
            <p className="text-sm text-gray-600 mt-2">Please try signing in again</p>
          </>
        )}
      </div>
    </div>
  );
}


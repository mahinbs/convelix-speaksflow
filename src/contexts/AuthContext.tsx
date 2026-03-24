import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle logout event
        if (event === 'SIGNED_OUT') {
          // Clear any cached data
          setSession(null);
          setUser(null);
          // Redirect to home page after logout
          window.location.href = '/';
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Get the current origin (protocol + hostname + port)
      const origin = window.location.origin;
      const redirectUrl = `${origin}/auth`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });
      return { error };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('Attempting to sign out...');

      // Clear local state first to provide immediate feedback
      setLoading(true);

      // Check if we have a session before attempting signout
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!currentSession) {
        console.log('No active session found, clearing local state');
        // No session exists, just clear local state
        setSession(null);
        setUser(null);
        setLoading(false);

        // Clear any localStorage items related to auth
        localStorage.removeItem('supabase.auth.token');

        return { error: null };
      }

      // Attempt to sign out from server
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Server signout error:', error);

        // Even if server signout fails, clear local state
        // This handles cases where the session is already invalid on the server
        if (error.message?.includes('session') || error.message?.includes('Auth session missing')) {
          console.log('Session already invalid, clearing local state anyway');
          setSession(null);
          setUser(null);
          setLoading(false);

          // Clear any localStorage items related to auth
          localStorage.removeItem('supabase.auth.token');

          return { error: null }; // Return success since we cleared local state
        }

        // For other errors, still try to clear local state but return the error
        setSession(null);
        setUser(null);
        setLoading(false);
        return { error };
      }

      console.log('Signout successful');

      // Clear state immediately
      setSession(null);
      setUser(null);
      setLoading(false);

      // Clear any localStorage items related to auth
      localStorage.removeItem('supabase.auth.token');

      return { error: null };
    } catch (err) {
      console.error('Unexpected signout error:', err);

      // Even on unexpected errors, try to clear local state
      setSession(null);
      setUser(null);
      setLoading(false);

      // Clear any localStorage items related to auth
      localStorage.removeItem('supabase.auth.token');

      return { error: err };
    }
  };

  const resetPassword = async (email: string) => {
    const origin = window.location.origin;
    const redirectUrl = `${origin}/auth/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

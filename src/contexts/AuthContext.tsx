import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useEventLogger } from '@/hooks/useEventLogger';

interface Profile {
  id: string;
  email: string;
  phone: string;
  role: 'employer' | 'candidate';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  createProfile: (phone: string, role: 'employer' | 'candidate') => Promise<{ error: any }>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Создаем временный экземпляр логгера для использования внутри контекста
  const tempLogEvent = async (eventType: string, payload?: any) => {
    try {
      await supabase.from('events').insert({
        user_id: user?.id || null,
        event_type: eventType,
        payload: payload || null
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  const fetchProfile = async () => {
    console.log('fetchProfile called, user:', user?.id);
    if (!user?.id) {
      console.log('No user ID, setting profile to null');
      setProfile(null);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, phone, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();
      
      if (data && !error) {
        console.log('Profile data loaded:', data);
        // Add email from auth.user for security (not from profiles table)
        setProfile({
          ...data,
          email: user.email!
        });
      } else {
        console.log('No profile found or error:', error);
        setProfile(null);
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session and set up auth listener
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session check:', !!session?.user);
          setSession(session);
          setUser(session?.user ?? null);
          
            // Load profile if user exists
            if (session?.user) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('id, role, phone, created_at, updated_at')
                .eq('id', session.user.id)
                .maybeSingle();
              
              console.log('Initial profile loaded:', !!profileData);
              if (profileData) {
                setProfile({
                  ...profileData,
                  email: session.user.email!
                });
              } else {
                setProfile(null);
              }
            }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, role, phone, created_at, updated_at')
            .eq('id', session.user.id)
            .maybeSingle();
          
          if (profileData) {
            setProfile({
              ...profileData,
              email: session.user.email!
            });
          } else {
            setProfile(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (!error) {
      await tempLogEvent('auth_signup', { email });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!error) {
      await tempLogEvent('auth_login', { email });
    }
    
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    
    if (!error) {
      await tempLogEvent('auth_login', { provider: 'google' });
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const createProfile = async (phone: string, role: 'employer' | 'candidate') => {
    if (!user) return { error: 'No user found' };

    // Сначала проверим, не существует ли уже профиль
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, role, phone, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      // Профиль уже существует, просто обновим состояние с email из auth
      setProfile({
        ...existingProfile,
        email: user.email!
      });
      return { error: null };
    }

    // Создаем новый профиль только если его нет (не сохраняем email в БД для безопасности)
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        phone,
        role
      });

    if (!error) {
      await fetchProfile();
    }

    return { error };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    createProfile,
    fetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
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
    if (!user?.id) {
      console.log('No user ID found, clearing profile');
      setProfile(null);
      return;
    }
    
    console.log('Fetching profile for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }
      
      console.log('Profile query result:', data);
      setProfile(data || null);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session check:', !!session?.user, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Если есть пользователь, сразу загружаем профиль
        if (session?.user) {
          console.log('Initial user found, loading profile immediately');
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Initial profile fetch error:', profileError);
            } else {
              console.log('Initial profile loaded:', profileData);
              setProfile(profileData || null);
            }
          } catch (err) {
            console.error('Initial profile fetch unexpected error:', err);
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
        
        console.log('Auth state change:', event, !!session?.user);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, fetching profile');
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Sign-in profile fetch error:', profileError);
            } else {
              console.log('Sign-in profile loaded:', profileData);
              setProfile(profileData || null);
            }
          } catch (err) {
            console.error('Sign-in profile fetch unexpected error:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing profile');
          setProfile(null);
        }
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
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      // Профиль уже существует, просто обновим состояние
      setProfile(existingProfile);
      return { error: null };
    }

    // Создаем новый профиль только если его нет
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email!,
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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
  signInAsGuest: () => void;
  signInWithGithub: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const savedGuest = localStorage.getItem('browseros-guest-mode');
    if (savedGuest === 'true') {
      setIsGuest(true);
      setUser({ id: 'guest-user', email: 'guest@browseros.local' } as any);
      setProfile({ username: 'Guest Explorer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest' });
      setLoading(false);
      return;
    }
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error) setProfile(data);
  };

  const signOut = async () => {
    localStorage.removeItem('browseros-guest-mode');
    setIsGuest(false);
    await supabase.auth.signOut();
  };

  const signInAsGuest = () => {
    localStorage.setItem('browseros-guest-mode', 'true');
    setIsGuest(true);
    setUser({ id: 'guest-user', email: 'guest@browseros.local' } as any);
    setProfile({ username: 'Guest Explorer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest' });
  };

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isGuest, signOut, signInAsGuest, signInWithGithub }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

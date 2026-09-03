import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { UserProfile } from '../types';
import { INITIAL_MOCK_USER } from '../data/mockUser';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, role: string, password?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'neurorest_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached auth user', e);
      }
    }
    // Default authenticated mock user for instant MVP demonstration
    return INITIAL_MOCK_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    // TODO: connect DB here -> supabase.auth.signInWithPassword({ email, password })
    const loggedInUser: UserProfile = {
      ...INITIAL_MOCK_USER,
      email: email || INITIAL_MOCK_USER.email,
      name: email ? email.split('@')[0].replace('.', ' ').toUpperCase() : INITIAL_MOCK_USER.name
    };
    setUser(loggedInUser);
    return true;
  };

  const signup = async (name: string, email: string, role: string, _password?: string): Promise<boolean> => {
    // TODO: connect DB here -> supabase.auth.signUp({ email, password, options: { data: { name, role } } })
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: role || 'Professional Specialist',
      avatarUrl: INITIAL_MOCK_USER.avatarUrl,
      dutyShiftHours: 10,
      lastRestBreak: 'Just started'
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_LOGGED_IN_USER = mockUsers[0];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user from a session
    setLoading(true);
    try {
        const sessionUser = sessionStorage.getItem('skill-swap-user');
        if (sessionUser) {
          setUser(JSON.parse(sessionUser));
        }
    } catch (error) {
        // Could be running in an environment without sessionStorage
    }
    setLoading(false);
  }, []);

  const login = (email: string) => {
    setLoading(true);
    // In a real app, this would be an API call to Firebase Auth
    const userToLogin = mockUsers.find(u => u.email === email) || MOCK_LOGGED_IN_USER;
    setUser(userToLogin);
     try {
        sessionStorage.setItem('skill-swap-user', JSON.stringify(userToLogin));
    } catch (error) {
        // Could be running in an environment without sessionStorage
    }
    setLoading(false);
  };

  const logout = () => {
    // In a real app, this would call Firebase Auth's signOut
    setUser(null);
    try {
        sessionStorage.removeItem('skill-swap-user');
    } catch (error) {
        // Could be running in an environment without sessionStorage
    }
  };

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

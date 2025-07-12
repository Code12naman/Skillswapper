'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile, SkillSwap } from '@/lib/types';
import { mockUsers as initialUsers, mockSwaps as initialSwaps } from '@/lib/mock-data';

interface Session {
  user: UserProfile | null;
  users: UserProfile[];
  swaps: SkillSwap[];
}

interface AuthContextType extends Session {
  loading: boolean;
  login: (details: { email: string; name?: string }) => void;
  logout: () => void;
  updateUser: (updatedProfile: Partial<UserProfile> & { id: string }) => void;
  addSwap: (newSwap: SkillSwap) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>({
    user: null,
    users: [],
    swaps: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = sessionStorage.getItem('skill-swap-user');
      const storedUsers = sessionStorage.getItem('skill-swap-users');
      const storedSwaps = sessionStorage.getItem('skill-swap-swaps');
      
      const sessionUser = storedUser ? JSON.parse(storedUser) : null;
      const sessionUsers = storedUsers ? JSON.parse(storedUsers) : initialUsers;
      const sessionSwaps = storedSwaps ? JSON.parse(storedSwaps) : initialSwaps;

      setSession({ user: sessionUser, users: sessionUsers, swaps: sessionSwaps });
    } catch (error) {
      console.error("Session storage error:", error);
      setSession({ user: null, users: initialUsers, swaps: initialSwaps });
    } finally {
      setLoading(false);
    }
  }, []);

  const persistSession = (newSession: Session) => {
    sessionStorage.setItem('skill-swap-user', JSON.stringify(newSession.user));
    sessionStorage.setItem('skill-swap-users', JSON.stringify(newSession.users));
    sessionStorage.setItem('skill-swap-swaps', JSON.stringify(newSession.swaps));
    setSession(newSession);
  };
  
  const login = ({ email, name }: { email: string; name?: string }) => {
    setSession(prevSession => {
      let userToLogin = prevSession.users.find(u => u.email === email);
      let updatedUsers = [...prevSession.users];
      
      if (!userToLogin && name) {
          const newUser: UserProfile = {
              id: `user_${new Date().getTime()}`,
              name,
              email,
              role: 'user',
              status: 'active',
              isPublic: true,
              skillsOffered: [],
              skillsWanted: [],
              availability: ['Weekends'],
              ratings: { average: 0, count: 0 },
              bio: 'Just joined! Looking forward to swapping skills.',
              profilePhotoUrl: 'https://placehold.co/128x128.png',
          };
          updatedUsers.push(newUser);
          userToLogin = newUser;
      }

      if (userToLogin?.status === 'banned') {
          console.error("This account has been banned.");
          return prevSession;
      }

      if (userToLogin) {
        const newSession = {...prevSession, user: userToLogin, users: updatedUsers};
        persistSession(newSession);
        return newSession;
      }
      
      return prevSession;
    });
  };

  const logout = () => {
    const newSession = {...session, user: null};
    sessionStorage.removeItem('skill-swap-user');
    setSession(newSession);
  };

  const updateUser = useCallback((updatedProfile: Partial<UserProfile> & { id: string }) => {
    setSession(prevSession => {
      const updatedUsers = prevSession.users.map(u => 
        u.id === updatedProfile.id ? { ...u, ...updatedProfile } : u
      );
      
      let updatedSessionUser = prevSession.user;
      if (prevSession.user?.id === updatedProfile.id) {
        updatedSessionUser = { ...prevSession.user, ...updatedProfile };
      }

      const newSession = { ...prevSession, user: updatedSessionUser, users: updatedUsers };
      persistSession(newSession);
      return newSession;
    });
  }, []);

  const addSwap = (newSwap: SkillSwap) => {
    setSession(prev => {
        const newSwaps = [...prev.swaps, newSwap];
        const newSession = {...prev, swaps: newSwaps};
        persistSession(newSession);
        return newSession;
    });
  };

  const value = { ...session, loading, login, logout, updateUser, addSwap };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { UserProfile, SkillSwap } from '@/lib/types';
import { mockUsers, mockSwaps as initialSwaps } from '@/lib/mock-data';

interface Session {
  user: UserProfile | null;
  swaps: SkillSwap[];
}

interface AuthContextType extends Session {
  loading: boolean;
  login: (details: { email: string; name?: string }) => void;
  logout: () => void;
  updateUser: (updatedProfile: Partial<UserProfile>) => void;
  addSwap: (newSwap: SkillSwap) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This ensures our mock data is a mutable copy we can update.
let activeMockUsers = [...mockUsers];
let activeMockSwaps = [...initialSwaps];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>({
    user: null,
    swaps: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = sessionStorage.getItem('skill-swap-user');
      const storedSwaps = sessionStorage.getItem('skill-swap-swaps');
      const storedUsers = sessionStorage.getItem('skill-swap-users');
      
      const sessionUser = storedUser ? JSON.parse(storedUser) : null;
      
      if (storedUsers) {
        activeMockUsers = JSON.parse(storedUsers);
      } else {
        sessionStorage.setItem('skill-swap-users', JSON.stringify(activeMockUsers));
      }
      
      if (storedSwaps) {
        activeMockSwaps = JSON.parse(storedSwaps);
      } else {
         sessionStorage.setItem('skill-swap-swaps', JSON.stringify(activeMockSwaps));
      }

      setSession({ user: sessionUser, swaps: activeMockSwaps });
    } catch (error) {
      console.error("Session storage error:", error);
      setSession({ user: null, swaps: initialSwaps });
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ email, name }: { email: string; name?: string }) => {
    let userToLogin = activeMockUsers.find(u => u.email === email);
    
    if (!userToLogin && name) {
        const newUser: UserProfile = {
            id: `user_${new Date().getTime()}`,
            name,
            email,
            isPublic: true,
            skillsOffered: [],
            skillsWanted: [],
            availability: ['Weekends'],
            ratings: { average: 0, count: 0 },
            bio: 'Just joined! Looking forward to swapping skills.',
            profilePhotoUrl: 'https://placehold.co/128x128.png',
        };
        activeMockUsers.push(newUser);
        sessionStorage.setItem('skill-swap-users', JSON.stringify(activeMockUsers));
        userToLogin = newUser;
    }

    if (userToLogin) {
      setSession(prev => ({...prev, user: userToLogin}));
      sessionStorage.setItem('skill-swap-user', JSON.stringify(userToLogin));
    }
  };

  const logout = () => {
    setSession(prev => ({...prev, user: null}));
    sessionStorage.removeItem('skill-swap-user');
  };

  const updateUser = useCallback((updatedProfile: Partial<UserProfile>) => {
    setSession(prevSession => {
      if (!prevSession.user) return prevSession;
      
      const updatedUser = { ...prevSession.user, ...updatedProfile };
      
      const userIndex = activeMockUsers.findIndex(u => u.id === updatedUser.id);
      if (userIndex !== -1) {
        activeMockUsers[userIndex] = updatedUser;
      }
      
      sessionStorage.setItem('skill-swap-user', JSON.stringify(updatedUser));
      sessionStorage.setItem('skill-swap-users', JSON.stringify(activeMockUsers));
      
      return { ...prevSession, user: updatedUser };
    });
  }, []);

  const addSwap = (newSwap: SkillSwap) => {
    setSession(prev => {
        const newSwaps = [...prev.swaps, newSwap];
        activeMockSwaps.push(newSwap);
        sessionStorage.setItem('skill-swap-swaps', JSON.stringify(activeMockSwaps));
        return {...prev, swaps: newSwaps};
    });
  };

  const value = { user: session.user, swaps: session.swaps, loading, login, logout, updateUser, addSwap };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

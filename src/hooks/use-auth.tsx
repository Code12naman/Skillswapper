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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [swaps, setSwaps] = useState<SkillSwap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = sessionStorage.getItem('skill-swap-user');
      const storedSwaps = sessionStorage.getItem('skill-swap-swaps');
      
      const sessionUser = storedUser ? JSON.parse(storedUser) : null;
      const sessionSwaps = storedSwaps ? JSON.parse(storedSwaps) : initialSwaps;

      if (sessionUser) {
        const userIndex = mockUsers.findIndex(u => u.id === sessionUser.id);
        if (userIndex > -1) {
            mockUsers[userIndex] = {...mockUsers[userIndex], ...sessionUser};
        } else {
            mockUsers.push(sessionUser);
        }
        setUser(sessionUser);
      }

      setSwaps(sessionSwaps);
      if (!storedSwaps) {
        sessionStorage.setItem('skill-swap-swaps', JSON.stringify(initialSwaps));
      }

    } catch (error) {
      console.error("Session storage error:", error);
      setUser(null);
      setSwaps(initialSwaps);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = ({ email, name }: { email: string; name?: string }) => {
    let userToLogin = mockUsers.find(u => u.email === email);
    
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
        mockUsers.push(newUser);
        userToLogin = newUser;
    }

    if (userToLogin) {
      setUser(userToLogin);
      sessionStorage.setItem('skill-swap-user', JSON.stringify(userToLogin));
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('skill-swap-user');
  };

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedProfile };
      setUser(updatedUser);

      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
      sessionStorage.setItem('skill-swap-user', JSON.stringify(updatedUser));
    }
  };

  const addSwap = (newSwap: SkillSwap) => {
    const newSwaps = [...swaps, newSwap];
    setSwaps(newSwaps);
    sessionStorage.setItem('skill-swap-swaps', JSON.stringify(newSwaps));
  };

  const value = { user, swaps, loading, login, logout, updateUser, addSwap };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

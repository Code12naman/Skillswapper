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

const defaultSession: Session = {
  user: null,
  swaps: [],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session>(defaultSession);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const storedUser = sessionStorage.getItem('skill-swap-user');
      const storedSwaps = sessionStorage.getItem('skill-swap-swaps');
      
      const user = storedUser ? JSON.parse(storedUser) : null;
      let swaps = storedSwaps ? JSON.parse(storedSwaps) : initialSwaps;

      if (!storedSwaps) {
        sessionStorage.setItem('skill-swap-swaps', JSON.stringify(initialSwaps));
      }
      
      if (user) {
         // Also update the user in the main mockUsers array to persist across sessions
        const userIndex = mockUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...user };
        }
      }

      setSession({ user, swaps });

    } catch (error) {
      console.error("Session storage not available or corrupted.", error);
      setSession(defaultSession);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSession = useCallback((newSession: Partial<Session>) => {
    setSession(prevSession => {
      const updatedSession = { ...prevSession, ...newSession };
      try {
        if (updatedSession.user) {
          sessionStorage.setItem('skill-swap-user', JSON.stringify(updatedSession.user));
        } else {
          sessionStorage.removeItem('skill-swap-user');
        }
        sessionStorage.setItem('skill-swap-swaps', JSON.stringify(updatedSession.swaps));
      } catch (error) {
        console.error("Could not update session storage", error);
      }
      return updatedSession;
    });
  }, []);


  const login = ({ email, name }: { email: string; name?: string }) => {
    let userToLogin = mockUsers.find(u => u.email === email);
    
    if (!userToLogin && name) { // Registration flow
        const newUser: UserProfile = {
            id: new Date().getTime().toString(),
            name: name,
            email,
            isPublic: true,
            skillsOffered: [],
            skillsWanted: [],
            availability: ['Weekends'],
            ratings: { average: 0, count: 0 },
            bio: 'Just joined! Looking forward to swapping skills.',
            profilePhotoUrl: `https://placehold.co/128x128.png`,
        };
        mockUsers.push(newUser);
        userToLogin = newUser;
    }

    if(userToLogin) {
      updateSession({ user: userToLogin });
    }
  };

  const logout = () => {
    updateSession({ user: null });
  };

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (session.user) {
      const updatedUser = { ...session.user, ...updatedProfile };
      
      const userIndex = mockUsers.findIndex(u => u.id === session.user!.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
      }
      updateSession({ user: updatedUser });
    }
  };

  const addSwap = (newSwap: SkillSwap) => {
    const newSwaps = [...session.swaps, newSwap];
    updateSession({ swaps: newSwaps });
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
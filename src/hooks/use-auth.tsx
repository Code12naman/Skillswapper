'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile, SkillSwap } from '@/lib/types';
import { mockUsers, mockSwaps as initialSwaps } from '@/lib/mock-data';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  swaps: SkillSwap[];
  login: (details: { email: string; name?: string }) => void;
  logout: () => void;
  updateUser: (updatedProfile: Partial<UserProfile>) => void;
  addSwap: (newSwap: SkillSwap) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [swaps, setSwaps] = useState<SkillSwap[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate checking for a logged-in user from a session
    setLoading(true);
    try {
      const sessionUser = sessionStorage.getItem('skill-swap-user');
      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }
      
      const sessionSwaps = sessionStorage.getItem('skill-swap-swaps');
      if (sessionSwaps) {
        setSwaps(JSON.parse(sessionSwaps));
      } else {
        setSwaps(initialSwaps); // Initialize with mock data if none in session
      }
    } catch (error) {
      // Could be running in an environment without sessionStorage
    }
    setLoading(false);
  }, []);

  const updateUserInSession = (updatedUser: UserProfile | null) => {
    setUser(updatedUser);
    try {
      if (updatedUser) {
        sessionStorage.setItem('skill-swap-user', JSON.stringify(updatedUser));
      } else {
        sessionStorage.removeItem('skill-swap-user');
      }
    } catch (error) {
      console.error("Could not update user in session storage", error);
    }
  }

  const updateSwapsInSession = (updatedSwaps: SkillSwap[]) => {
    setSwaps(updatedSwaps);
    try {
      sessionStorage.setItem('skill-swap-swaps', JSON.stringify(updatedSwaps));
    } catch (error) {
      console.error("Could not update swaps in session storage", error);
    }
  };

  const login = ({ email, name }: { email: string; name?: string }) => {
    setLoading(true);
    let userToLogin: UserProfile;

    if (name) {
      // New registration
      userToLogin = {
        id: new Date().getTime().toString(),
        name,
        email,
        isPublic: true,
        skillsOffered: [],
        skillsWanted: [],
        availability: ['Weekends'],
        ratings: { average: 0, count: 0 },
        bio: 'Just joined! Looking forward to swapping skills.',
      };
    } else {
      // Existing user
      userToLogin = mockUsers.find(u => u.email === email) || mockUsers[0];
    }
    
    updateUserInSession(userToLogin);
    // On login, filter swaps for the logged-in user to simulate a real DB fetch
    const userSwaps = initialSwaps.filter(s => s.requesterId === userToLogin.id || s.receiverId === userToLogin.id);
    updateSwapsInSession(userSwaps);
    
    setLoading(false);
  };

  const logout = () => {
    updateUserInSession(null);
    updateSwapsInSession([]); // Clear swaps on logout
    try {
      sessionStorage.removeItem('skill-swap-swaps');
    } catch (error) {
      console.error("Could not remove swaps from session storage", error);
    }
  };

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...updatedProfile };
      updateUserInSession(newUser);
    }
  };

  const addSwap = (newSwap: SkillSwap) => {
    const updatedSwaps = [...swaps, newSwap];
    updateSwapsInSession(updatedSwaps);
  };

  const value = { user, loading, login, logout, updateUser, swaps, addSwap };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

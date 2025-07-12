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
    setLoading(true);
    try {
      const sessionUser = sessionStorage.getItem('skill-swap-user');
      if (sessionUser) {
        const loggedInUser = JSON.parse(sessionUser);
        const userInMock = mockUsers.find(u => u.id === loggedInUser.id);
        if (userInMock) {
            // Update the mock user with the session data to keep it consistent
            Object.assign(userInMock, loggedInUser);
        }
        setUser(loggedInUser);
      }
      
      const sessionSwaps = sessionStorage.getItem('skill-swap-swaps');
      if (sessionSwaps) {
        setSwaps(JSON.parse(sessionSwaps));
      } else {
        sessionStorage.setItem('skill-swap-swaps', JSON.stringify(initialSwaps));
        setSwaps(initialSwaps);
      }
    } catch (error) {
      console.error("Session storage not available.", error);
    } finally {
        setLoading(false);
    }
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
    let existingUser = mockUsers.find(u => u.email === email);
    
    if (!existingUser && name) {
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
            profilePhotoUrl: 'https://placehold.co/128x128.png',
        };
        mockUsers.push(newUser);
        existingUser = newUser;
    } else if (!existingUser) {
       // For login, if user doesn't exist, don't log in.
       // In a real app, you'd show an error. Here we just do nothing.
       setLoading(false);
       return;
    }

    updateUserInSession(existingUser);

    try {
      const allSwapsJSON = sessionStorage.getItem('skill-swap-swaps');
      const allSwaps = allSwapsJSON ? JSON.parse(allSwapsJSON) : initialSwaps;
      const userSwaps = allSwaps.filter((s: SkillSwap) => s.requesterId === existingUser!.id || s.receiverId === existingUser!.id);
      setSwaps(userSwaps);
    } catch(e) {
      console.error(e);
      setSwaps([]);
    }
    
    setLoading(false);
  };

  const logout = () => {
    updateUserInSession(null);
    setSwaps([]); 
  };

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedProfile };
      updateUserInSession(updatedUser);

      // Also update the user in the main mockUsers array to persist across sessions
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
      }
    }
  };

  const addSwap = (newSwap: SkillSwap) => {
    try {
      const allSwapsJSON = sessionStorage.getItem('skill-swap-swaps');
      let allSwaps = allSwapsJSON ? JSON.parse(allSwapsJSON) : initialSwaps;
      allSwaps.push(newSwap);
      updateSwapsInSession(allSwaps);
      if (user) {
          const userSwaps = allSwaps.filter((s: SkillSwap) => s.requesterId === user.id || s.receiverId === user.id);
          setSwaps(userSwaps);
      }
    } catch(e) {
        console.error(e)
    }
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

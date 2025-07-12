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
        // If no swaps in session, start with the mock data
        sessionStorage.setItem('skill-swap-swaps', JSON.stringify(initialSwaps));
        setSwaps(initialSwaps);
      }
    } catch (error) {
      // Could be running in an environment without sessionStorage
      console.error("Session storage not available.", error);
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
    // Find if user exists in our mock data or session storage mock data
    let existingUser = mockUsers.find(u => u.email === email);
    
    // In a real app, you would have a single source of truth (your backend DB)
    // Here we merge mock data and potential new users.
    // This is a simplified logic for mock purposes.
    if (!existingUser) {
        // Let's pretend our "database" can grow
        const potentialNewUser = {
            id: new Date().getTime().toString(),
            name: name || 'New User',
            email,
            isPublic: true,
            skillsOffered: [],
            skillsWanted: [],
            availability: ['Weekends'],
            ratings: { average: 0, count: 0 },
            bio: 'Just joined! Looking forward to swapping skills.',
        };
        // If a name is provided, it's a registration attempt.
        if (name) {
            // In a real app, you'd save this to the DB.
            // For this mock, we'll just use this new user object.
            existingUser = potentialNewUser;
            // Add to our runtime list of users
            if (!mockUsers.some(u => u.email === email)) {
                mockUsers.push(existingUser);
            }
        } else {
            // Login attempt for a user that doesn't exist. For mock, let's log in as first user.
            existingUser = mockUsers[0];
        }
    }

    updateUserInSession(existingUser);

    try {
      const allSwapsJSON = sessionStorage.getItem('skill-swap-swaps');
      const allSwaps = allSwapsJSON ? JSON.parse(allSwapsJSON) : initialSwaps;
      const userSwaps = allSwaps.filter((s: SkillSwap) => s.requesterId === existingUser!.id || s.receiverId === existingUser!.id);
      setSwaps(userSwaps); // Only set the swaps for the logged in user
    } catch(e) {
      console.error(e);
      setSwaps([]);
    }
    
    setLoading(false);
  };

  const logout = () => {
    updateUserInSession(null);
    setSwaps([]); // Clear swaps on logout
    try {
      sessionStorage.removeItem('skill-swap-swaps');
      sessionStorage.removeItem('skill-swap-user');
    } catch (error) {
      console.error("Could not clear session storage", error);
    }
  };

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...updatedProfile };
      updateUserInSession(newUser);
    }
  };

  const addSwap = (newSwap: SkillSwap) => {
    try {
      const allSwapsJSON = sessionStorage.getItem('skill-swap-swaps');
      let allSwaps = allSwapsJSON ? JSON.parse(allSwapsJSON) : initialSwaps;
      allSwaps.push(newSwap);
      updateSwapsInSession(allSwaps);
       // After adding, filter to show only the current user's swaps.
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

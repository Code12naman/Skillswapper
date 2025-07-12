'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { UserProfile } from '@/lib/types';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (details: { email: string; name?: string }) => void;
  logout: () => void;
  updateUser: (updatedProfile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_LOGGED_IN_USER = mockUsers[0];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

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

  const updateUserInSession = (updatedUser: UserProfile | null) => {
    if (updatedUser) {
      setUser(updatedUser);
      try {
        sessionStorage.setItem('skill-swap-user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Could not update user in session storage", error);
      }
    }
  }

  const login = ({ email, name }: { email: string; name?: string }) => {
    setLoading(true);
    // In a real app, this would be an API call to Firebase Auth
    let userToLogin: UserProfile;

    if (name) {
      // This is a new registration
      userToLogin = {
        id: new Date().getTime().toString(), // semi-unique id
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
      // This is an existing user logging in
      userToLogin = mockUsers.find(u => u.email === email) || MOCK_LOGGED_IN_USER;
    }
    
    updateUserInSession(userToLogin);
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

  const updateUser = (updatedProfile: Partial<UserProfile>) => {
    if (user) {
      const newUser = { ...user, ...updatedProfile };
      updateUserInSession(newUser);
    }
  };

  const value = { user, loading, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

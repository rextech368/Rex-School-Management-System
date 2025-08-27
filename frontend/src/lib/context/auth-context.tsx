import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, getUserRole, getUserId, logout } from '../utils/auth';
import apiClient from '../api/api-client';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUserAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load user data on initial render
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated()) {
        setIsAuthenticated(true);
        await refreshUser();
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };

    loadUserData();
  }, []);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const response = await apiClient.get<User>(`/users/${userId}`);
      if (response.success) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        logout();
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ token: string }>('/auth/login', { email, password });
      
      if (response.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        await refreshUser();
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isUserAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


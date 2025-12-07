"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthCredentials, User } from '../types/auth';
import { setAuthTokenProvider } from '../lib/apiClient';
import * as authService from '../services/authService';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      // You might want to fetch the user profile here
    }
  }, []);

  useEffect(() => {
    setAuthTokenProvider(() => token);
  }, [token]);

  const login = async (credentials: AuthCredentials) => {
    const response = await authService.loginUser(credentials);
    const { token } = response.data;
    setToken(token);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    // Fetch user profile after login
    const profileResponse = await authService.getUserProfile();
    setUser(profileResponse.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

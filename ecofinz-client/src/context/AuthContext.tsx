"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, AuthCredentials, User } from '../types/auth';
import { setAuthTokenProvider } from '../lib/apiClient';
import * as authService from '../services/authService';

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthTokenProvider(() => storedToken); // Configure client immediately
        try {
          const profileResponse = await authService.getUserProfile();
          // If we get here, the token is valid
          setToken(storedToken);
          setUser(profileResponse.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Token is invalid, clear everything
          console.error('Failed to authenticate with stored token', error);
          localStorage.removeItem('token');
          setAuthTokenProvider(() => null); // De-configure client
        }
      }
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const response = await authService.loginUser(credentials);
    const { access_token: newToken } = response.data;
    
    localStorage.setItem('token', newToken);
    setAuthTokenProvider(() => newToken); // Configure client

    setToken(newToken);
    setIsAuthenticated(true);
    
    // Fetch user profile after login
    const profileResponse = await authService.getUserProfile();
    setUser(profileResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthTokenProvider(() => null); // De-configure client
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    loading,
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

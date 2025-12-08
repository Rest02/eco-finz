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
    const fetchUserProfile = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          setToken(storedToken);
          setAuthTokenProvider(() => storedToken); // Ensure apiClient is configured before request
          const profileResponse = await authService.getUserProfile();
          setUser(profileResponse.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch profile with stored token', error);
          // Token might be invalid/expired, so log out
          logout();
        }
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    setAuthTokenProvider(() => token);
  }, [token]);

  const login = async (credentials: AuthCredentials) => {
    const response = await authService.loginUser(credentials);
    const { access_token: token } = response.data;
    
    // Immediately update the API client with the new token before the next request
    setAuthTokenProvider(() => token);

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

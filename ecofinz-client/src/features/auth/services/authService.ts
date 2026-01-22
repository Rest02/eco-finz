import apiClient from '@/lib/apiClient';
import { AuthCredentials, RegisterData, VerifyPin } from '../types/auth';

export const registerUser = (data: RegisterData) => {
  return apiClient.post('/auth/register', data);
};

export const verifyUser = (data: VerifyPin) => {
  return apiClient.post('/auth/verify', data);
};

export const loginUser = (credentials: AuthCredentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const getUserProfile = () => {
  return apiClient.get('/auth/profile');
};

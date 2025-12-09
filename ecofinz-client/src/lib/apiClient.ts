import axios, { InternalAxiosRequestConfig } from 'axios';

let getToken: () => string | null = () => null;

export const setAuthTokenProvider = (tokenProvider: () => string | null) => {
  getToken = tokenProvider;
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

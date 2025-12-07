export interface AuthCredentials {
    email: string;
    password?: string;
}
  
export interface RegisterData extends AuthCredentials {
    name: string;
}
  
export interface VerifyPin {
    email: string;
    verifyPin: string;
}
  
export interface User {
    id: string;
    name: string;
    email: string;
}
  
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
    login: (credentials: AuthCredentials) => Promise<void>;
    logout: () => void;
}

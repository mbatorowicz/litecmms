import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import axios, { type AxiosError } from 'axios';

interface User {
  readonly id: string;
  readonly email: string;
  readonly name?: string;
  readonly role?: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

interface AuthError {
  message: string;
  code?: string;
  details?: unknown;
}

interface AuthState {
  readonly token: string | null;
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: AuthError | null;

  // Actions
  readonly login: (email: string, password: string) => Promise<void>;
  readonly logout: () => void;
  readonly clearError: () => void;
  readonly setUser: (user: User | null) => void;
  readonly refreshToken: () => Promise<void>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const useAuth = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });
            
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
              email,
              password,
            });
            
            const { token, user } = response.data as { token: string; user: User };
            
            set({ 
              token, 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            
            // Set default authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
          } catch (error) {
            const authError: AuthError = {
              message: 'Błąd logowania',
              code: 'LOGIN_FAILED'
            };

            if (error instanceof Error) {
              const axiosError = error as AxiosError<{ message?: string }>;
              authError.message = axiosError.response?.data?.message ?? error.message;
              authError.details = axiosError.response?.data;
            }
            
            set({ 
              isLoading: false, 
              error: authError,
              token: null,
              user: null,
              isAuthenticated: false 
            });
            
            throw authError;
          }
        },

        logout: () => {
          set({ 
            token: null, 
            user: null, 
            isAuthenticated: false,
            error: null 
          });
          delete axios.defaults.headers.common['Authorization'];
        },

        clearError: () => {
          set({ error: null });
        },

        setUser: (user: User | null) => {
          set({ user });
        },

        refreshToken: async () => {
          try {
            const { token } = get();
            if (!token) throw new Error('No token available');

            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const { token: newToken, user } = response.data as { token: string; user: User };
            
            set({ 
              token: newToken, 
              user,
              isAuthenticated: true 
            });
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            
          } catch (error) {
            const authError: AuthError = {
              message: 'Nie udało się odświeżyć sesji',
              code: 'REFRESH_FAILED'
            };

            set({ 
              error: authError,
              token: null,
              user: null,
              isAuthenticated: false 
            });
            
            delete axios.defaults.headers.common['Authorization'];
            throw authError;
          }
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          token: state.token,
          user: state.user,
          isAuthenticated: state.isAuthenticated
        })
      }
    ),
    { name: 'auth-store' }
  )
); 
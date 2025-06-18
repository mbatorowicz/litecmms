"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sprawdź token w localStorage przy starcie
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Pobierz dane użytkownika na podstawie tokena
  const fetchUser = async () => {
    try {
      const res = await apiClient.get<User>('/api/auth/me');
      setUser(res.data);
    } catch (e) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Logowanie
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiClient.post<{token: string; user: User}>('/api/auth/login', { email, password });
      if (res.data && res.data.token && res.data.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        router.push('/');
      } else {
        console.error('Nieprawidłowa odpowiedź z serwera:', res?.data);
        throw new Error('Nieprawidłowa odpowiedź z serwera');
      }
    } catch (e) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      console.error('Błąd logowania:', e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Wylogowanie
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/login');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
} 
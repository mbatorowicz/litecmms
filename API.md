# LiteCMMS API Documentation v2.0

## Podstawowe informacje

- **Base URL**: `http://localhost:3001`
- **Wersja API**: 2.0
- **Format odpowiedzi**: JSON
- **Autoryzacja**: JWT (JSON Web Token)

## Konfiguracja Frontendu

### Zmienne środowiskowe
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=LiteCMMS
NEXT_PUBLIC_APP_VERSION=2.0.0
```

### Wymagane zależności
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "i18next": "^23.0.0",
    "react-i18next": "^13.0.0",
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "lucide-react": "^0.300.0",
    "zustand": "^4.0.0"
  }
}
```

### Konfiguracja i18n
```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: ['pl'],
    interpolation: {
      escapeValue: false,
    },
    resources: {
      pl: {
        common: require('./locales/pl/common.json'),
        dashboard: require('./locales/pl/dashboard.json'),
        machines: require('./locales/pl/machines.json'),
        workorders: require('./locales/pl/workorders.json'),
        parts: require('./locales/pl/parts.json'),
        users: require('./locales/pl/users.json'),
        reports: require('./locales/pl/reports.json')
      },
      en: {
        common: require('./locales/en/common.json'),
        dashboard: require('./locales/en/dashboard.json'),
        machines: require('./locales/en/machines.json'),
        workorders: require('./locales/en/workorders.json'),
        parts: require('./locales/en/parts.json'),
        users: require('./locales/en/users.json'),
        reports: require('./locales/en/reports.json')
      },
      de: {
        common: require('./locales/de/common.json'),
        dashboard: require('./locales/de/dashboard.json'),
        machines: require('./locales/de/machines.json'),
        workorders: require('./locales/de/workorders.json'),
        parts: require('./locales/de/parts.json'),
        users: require('./locales/de/users.json'),
        reports: require('./locales/de/reports.json')
      }
    }
  });

export default i18n;
```

### Konfiguracja Axios
```typescript
// api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Store (Zustand)
```typescript
// store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  language: string;
  company?: {
    id: string;
    name: string;
  };
  locations?: Array<{
    id: string;
    name: string;
  }>;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Hooks
```typescript
// hooks/useAuth.ts
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import api from '@/api/axios';

export const useAuth = () => {
  const router = useRouter();
  const { setUser, setTokens, logout } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      setUser(user);
      setTokens(accessToken, refreshToken);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  }, [router, setUser, setTokens]);

  const handleLogout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router, logout]);

  return {
    login,
    logout: handleLogout,
  };
};
```

### Komponenty
```typescript
// components/common/LanguageSwitcher.tsx
'use client';

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = () => {
    const currentIndex = languages.findIndex(lang => lang.code === i18n.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    i18n.changeLanguage(languages[nextIndex].code);
  };

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span>{currentLanguage.flag}</span>
    </button>
  );
};
```

## System Autoryzacji

### Architektura
System autoryzacji opiera się na JWT (JSON Web Tokens) z następującymi komponentami:

1. **Access Token** - krótkoterminowy token (15 minut)
2. **Refresh Token** - długoterminowy token (7 dni)
3. **Cookies** - bezpieczne przechowywanie tokenów
4. **Interceptory** - automatyczne odświeżanie tokenów

### Flow Autoryzacji

1. **Logowanie**
```typescript
// Przykład użycia w komponencie
const { login } = useAuth();

const handleLogin = async (email: string, password: string) => {
  try {
    await login(email, password);
    // Przekierowanie do dashboardu
  } catch (error) {
    // Obsługa błędów
  }
};
```

2. **Automatyczne odświeżanie tokenów**
```typescript
// api/axios.ts
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await api.post('/api/auth/refresh', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return api(error.config);
      } catch {
        // Wylogowanie przy nieudanym odświeżeniu
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

3. **Zarządzanie stanem autoryzacji**
```typescript
// store/auth.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Zabezpieczenia

1. **CORS**
```typescript
// server/index.ts
app.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

2. **Rate Limiting**
```typescript
// server/plugins/rateLimit.ts
export const rateLimit = {
  global: {
    max: 100,
    timeWindow: '1 minute'
  },
  auth: {
    max: 5,
    timeWindow: '1 minute'
  }
};
```

3. **Walidacja tokenów**
```typescript
// server/plugins/jwt.ts
export const verifyToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Nieprawidłowy token');
  }
};
```

### Endpointy Autoryzacji

1. **Logowanie**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

2. **Odświeżanie tokenu**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token"
}
```

3. **Wylogowanie**
```http
POST /api/auth/logout
Authorization: Bearer access_token
```

4. **Sprawdzenie sesji**
```http
GET /api/auth/me
Authorization: Bearer access_token
```

### Obsługa błędów

```typescript
// types/errors.ts
export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Przykłady błędów
const errors = {
  INVALID_CREDENTIALS: {
    code: 'AUTH_001',
    message: 'Nieprawidłowy email lub hasło'
  },
  TOKEN_EXPIRED: {
    code: 'AUTH_002',
    message: 'Token wygasł'
  },
  INVALID_TOKEN: {
    code: 'AUTH_003',
    message: 'Nieprawidłowy token'
  },
  RATE_LIMIT: {
    code: 'AUTH_004',
    message: 'Przekroczono limit prób logowania'
  }
};
```

### Middleware Autoryzacji

```typescript
// server/middleware/auth.ts
export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('Brak tokenu autoryzacji');
    }

    const decoded = await verifyToken(token);
    request.user = decoded;

    return;
  } catch (error) {
    reply.status(401).send({
      error: 'Błąd autoryzacji',
      message: error.message
    });
  }
};
```

### Testy Autoryzacji

```typescript
// tests/auth.test.ts
describe('Auth System', () => {
  it('should login user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should refresh token', async () => {
    const { refreshToken } = await loginUser();
    
    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });
});
```

## Endpointy systemowe

### Health Check
```http
GET /health
```
Sprawdza czy serwer działa poprawnie.

**Odpowiedź:**
```json
{
  "status": "ok",
  "message": "LiteCMMS Server is running",
  "timestamp": "2024-03-15T12:00:00.000Z",
  "version": "2.0.0"
}
```

### Status API
```http
GET /api/status
```
Zwraca informacje o statusie API i dostępnych endpointach.

**Odpowiedź:**
```json
{
  "api": "LiteCMMS API v2.0",
  "status": "operational",
  "timestamp": "2024-03-15T12:00:00.000Z",
  "endpoints": [
    "GET /health",
    "GET /api/status",
    "GET /api/system-status"
  ]
}
```

### Status Systemu
```http
GET /api/system-status
```
Zwraca szczegółowe informacje o statusie systemu, w tym połączenie z bazą danych.

**Odpowiedź:**
```json
{
  "apiServer": {
    "status": "ok",
    "message": "Połączenie aktywne"
  },
  "database": {
    "status": "ok",
    "message": "Połączenie z bazą danych aktywne"
  },
  "services": {
    "total": 2,
    "running": 2,
    "stopped": 0
  },
  "timestamp": "2024-03-15T12:00:00.000Z"
}
```

## Endpointy autoryzacji

### Rejestracja
```http
POST /api/auth/register
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "username": "newuser",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "password": "password123",
  "companyName": "Firma XYZ",
  "phone": "+48123456789"
}
```

**Odpowiedź:**
```json
{
  "success": true,
  "message": "Konto zostało pomyślnie utworzone",
  "user": {
    "id": "123",
    "email": "newuser@example.com",
    "username": "newuser",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "role": "user"
  }
}
```

## Kody błędów

- `400` - Błąd walidacji
- `401` - Brak autoryzacji
- `403` - Brak uprawnień
- `404` - Nie znaleziono zasobu
- `409` - Konflikt (np. użytkownik już istnieje)
- `500` - Błąd serwera

## Przykłady błędów

### Błąd walidacji
```json
{
  "error": "Błąd walidacji",
  "message": "Nieprawidłowy format email",
  "details": [
    {
      "code": "invalid_string",
      "path": ["email"],
      "message": "Nieprawidłowy format email"
    }
  ]
}
```

### Błąd autoryzacji
```json
{
  "error": "Nieprawidłowe dane logowania",
  "message": "Email lub hasło jest nieprawidłowe"
}
```

### Błąd serwera
```json
{
  "error": "Błąd serwera",
  "message": "Wystąpił błąd podczas przetwarzania żądania"
}
``` 
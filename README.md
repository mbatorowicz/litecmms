# LiteCMMS v2.0 - Advanced CMMS System

## 📋 Opis Projektu

**LiteCMMS v2.0** to nowoczesny system zarządzania konserwacją i utrzymaniem ruchu (CMMS) przeznaczony dla średnich przedsiębiorstw (do 50 użytkowników).

### 🎯 Główne Funkcjonalności
- Zarządzanie maszynami i urządzeniami
- Planowanie i śledzenie konserwacji
- Zarządzanie częściami zamiennymi i magazynem
- System zgłoszeń i zleceń pracy
- Raporty i analityka
- 5 poziomów ról użytkowników
- Wielojęzyczność (PL/EN/DE)
- Professional Dashboard z KPI Cards, Alert Panel, Maintenance Calendar

## 🏗️ Architektura Monorepo

### 📁 Struktura Projektu
```
LiteCMMS/
├── apps/
│   ├── web/          # Frontend (Next.js 15, App Router)
│   └── api/          # Backend (Fastify)
├── packages/
│   ├── shared/       # Wspólne typy i utilities
│   ├── ui/           # Wspólne komponenty UI
│   └── config/       # Konfiguracja (ESLint, TypeScript)
├── scripts/          # Skrypty PowerShell automatyzacji
└── turbo.json        # Konfiguracja Turborepo
```

## 🛠️ Stack Techniczny

### Frontend (apps/web/)
- **Next.js 15** - React framework z App Router
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Stylowanie
- **Radix UI** - Komponenty UI
- **Wielojęzyczność** - i18n z obsługą PL/EN/DE
- **Zustand** - State management

### Backend (apps/api/)
- **Fastify** - Szybki web framework dla Node.js
- **TypeScript** - Typowanie statyczne
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Baza danych
- **JWT** - Autoryzacja
- **WebSockets** - Komunikacja real-time

### DevOps & Narzędzia
- **pnpm workspaces** - Zarządzanie zależnościami monorepo
- **Turborepo** - Optymalizacja budowania i cachowania
- **ESLint & Prettier** - Linting i formatowanie kodu
- **PowerShell Scripts** - Automatyzacja uruchomienia

## 🚀 Uruchomienie Projektu

### Wymagania
- Node.js 18+
- pnpm 9.0+
- PostgreSQL (lokalnie lub Docker)

### Instalacja

1. **Klonowanie i instalacja zależności:**
```bash
git clone <repository-url>
cd LiteCMMS
pnpm install
```

2. **Konfiguracja bazy danych:**
```bash
# Sprawdź plik database.env (już skonfigurowany)
# DATABASE_URL="postgresql://postgres:8C5c3Aab5@localhost:5432/litecmms?schema=public"

# Uruchom generowanie Prisma client
pnpm db:generate
pnpm db:push
```

3. **Uruchomienie w trybie development:**

**MONOREPO (zalecane):**
```bash
# Uruchom cały system - backend + frontend
pnpm dev

# Uruchom tylko backend API
pnpm dev:api

# Uruchom tylko frontend
pnpm dev:web
```

**Alternatywnie (skrypty PowerShell):**
```bash
# Uruchom cały system jedną komendą
pnpm simple:start
```

### Dostęp do aplikacji
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **System Status**: http://localhost:3001/api/system-status

## 🔧 Dostępne Skrypty

### Skrypty monorepo:
```bash
pnpm dev                # Uruchom wszystkie aplikacje
pnpm dev:web           # Frontend (Next.js)
pnpm dev:api           # Backend (Fastify)
pnpm build             # Build wszystkich aplikacji
pnpm lint              # Linting całego projektu
pnpm type-check        # Type checking
pnpm clean             # Czyszczenie buildów
```

### Skrypty bazy danych:
```bash
pnpm db:generate       # Generuj Prisma client
pnpm db:push          # Push schema do bazy
pnpm db:studio        # Prisma Studio
```

### Skrypty zarządzania systemem:
```bash
pnpm simple:start     # Uruchom cały system (PowerShell)
pnpm sys:stop         # Zatrzymaj wszystkie procesy
pnpm sys:status       # Sprawdź status komponentów
```

## 🌐 Wielojęzyczność

Aplikacja obsługuje 3 języki:
- **Polski (PL)** - domyślny
- **Angielski (EN)**
- **Niemiecki (DE)**

Przełączanie języków dostępne w interfejsie użytkownika.

## 👥 Role Użytkowników

1. **Super Admin** - Pełny dostęp do systemu
2. **Administrator** - Zarządzanie użytkownikami i konfiguracją
3. **Menadżer** - Zarządzanie operacyjne
4. **Operator** - Zgłaszanie awarii/potrzeby interwencji technika
5. **Technik** - Wykonywanie prac konserwacyjnych
6. **Raporty** - Tylko odczyt/generowanie raportów, analiz

## 📊 Dashboard Features

### KPI Cards
- OEE (Overall Equipment Effectiveness): 87.5%
- Dostępność maszyn: 94.2%
- MTTR (Mean Time To Repair): 2.3h
- Koszty konserwacji: 15.4k PLN

### Alert Panel
- Krytyczne awarie
- Ostrzeżenia konserwacji
- Alerty magazynowe

### Maintenance Calendar
- Zadania dzisiaj/nadchodzące/przeterminowane
- Machine Status Overview (5 maszyn w czasie rzeczywistym)

## 🎯 Korzyści Architektury Monorepo

### 1. Separacja Odpowiedzialności
- Frontend i backend w oddzielnych aplikacjach
- Wspólny kod w dedykowanych pakietach
- Czytelna struktura folderów

### 2. Optymalizacja Wydajności
- Turborepo cache dla szybszych buildów
- Równoległe uruchamianie procesów
- Incremental builds

### 3. Developer Experience
- Lepsze IDE support
- Jasne zależności między pakietami
- Zintegrowane linting i type checking

### 4. Skalowalność
- Łatwe dodawanie nowych aplikacji
- Możliwość separacji do mikrousług
- Przygotowanie pod deployment

## 💡 Status Refaktoryzacji

**✅ UKOŃCZONE:**
- Modernizacja do struktury monorepo
- Separacja frontend/backend
- Konfiguracja pnpm workspaces + Turborepo
- Migracja do nowoczesnej architektury 2025
- Professional dashboard z wszystkimi komponentami
- Wielojęzyczność PL/EN/DE
- JWT autoryzacja
- TypeScript bez błędów kompilacji

**📊 Rezultat:**
System przygotowany pod skalowanie, łatwy w utrzymaniu, z czystą architekturą i nowoczesnymi standardami development.

---

**Wersja**: 2.0.0  
**Status**: ✅ Produkcyjny - Monorepo Structure Ready  
**Ostatnia aktualizacja**: Styczeń 2025 
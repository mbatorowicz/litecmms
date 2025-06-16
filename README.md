# LiteCMMS v2.0

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

## 🛠️ Stack Techniczny

### Frontend
- **Next.js 15** - React framework z App Router
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS** - Stylowanie
- **Wielojęzyczność** - i18n z obsługą PL/EN/DE

### Backend
- **Fastify** - Szybki web framework dla Node.js
- **TypeScript** - Typowanie statyczne
- **Prisma ORM** - Object-Relational Mapping
- **PostgreSQL** - Baza danych
- **JWT** - Autoryzacja
- **WebSockets** - Komunikacja real-time

### DevOps & Narzędzia
- **Nodemon** - Auto-restart podczas developmentu
- **ESLint** - Linting kodu
- **Prettier** - Formatowanie kodu
- **PowerShell Scripts** - Automatyzacja uruchomienia

## 🚀 Uruchomienie Projektu

### Wymagania
- Node.js 18+
- npm lub yarn
- PostgreSQL (lokalnie lub Docker)

### Instalacja

1. **Klonowanie i instalacja zależności:**
```bash
git clone <repository-url>
cd LiteCMMS
npm install
```

2. **Konfiguracja bazy danych:**

**UWAGA**: Projekt używa `database.env` zamiast `.env` + hardkodowany fallback w kodzie.

```bash
# Sprawdź plik database.env (już skonfigurowany)
# DATABASE_URL="postgresql://postgres:8C5c3Aab5@localhost:5432/litecmms?schema=public"

# Uruchom migracje Prisma
npx prisma migrate dev
npx prisma generate
```

3. **Uruchomienie w trybie development:**

**ZALECANE (automatyczne):**
```bash
# Uruchom cały system jedną komendą (DZIAŁA ZAWSZE!)
npm run simple:start
```

**Alternatywnie (ręcznie):**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev
```

### Dostęp do aplikacji
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **System Status**: http://localhost:3001/api/system-status

## 📁 Struktura Projektu

```
LiteCMMS/
├── app/                    # Frontend Next.js (App Router)
│   ├── page.tsx           # Główna strona (po refaktorze: 16 linii!)
│   ├── layout.tsx         # Layout aplikacji
│   └── globals.css        # Style globalne
├── components/            # Komponenty React (po refaktorze)
│   ├── ui/               # Komponenty UI wielokrotnego użytku
│   │   ├── StatusIndicator.tsx
│   │   └── LanguageSwitcher.tsx
│   └── dashboard/        # Komponenty specyficzne dla dashboard
│       ├── DashboardHeader.tsx
│       ├── SystemStatusCard.tsx
│       ├── FeatureCards.tsx
│       └── SystemInfoCard.tsx
├── lib/                  # Utilities i konfiguracja
│   └── hooks/           # Custom React hooks
│       └── useSystemStatus.ts
├── locales/             # Pliki językowe (PL/EN/DE)
├── server/              # Backend Fastify
│   ├── index.ts         # Główny plik serwera
│   ├── routes/          # API routes
│   └── middleware/      # Middleware
├── scripts/             # Skrypty automatyzacji
│   ├── simple-start.ps1 # Główny skrypt uruchamiający
│   └── system-manager.ps1
├── prisma/              # Schema bazy danych
│   └── schema.prisma    # Definicje modeli
└── package.json         # Zależności i skrypty
```

## 🔧 Dostępne Skrypty

### Zarządzanie systemem (ZALECANE):
```bash
npm run simple:start # Uruchom cały system (backend + frontend) - NIEZAWODNY!
npm run sys:stop     # Zatrzymaj wszystkie procesy
npm run sys:status   # Sprawdź status wszystkich komponentów
```

### Skrypty podstawowe:
```bash
npm run dev          # Frontend (Next.js) - TYLKO port 3000!
npm run dev:server   # Backend (Fastify) - port 3001
npm run build        # Build produkcyjny
npm run start        # Start produkcyjny
npm run lint         # Linting
```

### Skrypty pomocnicze:
```bash
npm run stop-all     # Zatrzymaj wszystko
npm run reset        # Pełny reset systemu
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
3. **Menadzer** - Zarządzanie operacyjne
4. **Operator** - Zgłaszanie awarii/potrzeby interwencji technika
4. **Technik** - Wykonywanie prac konserwacyjnych
5. **Raporty** - Tylko odczyt/generowanie raportów, analiz

## 📊 Status Systemu

**Sprawdzenie statusu:**
```bash
npm run sys:status  # Kompletny status systemu
```

**Lub bezpośrednio:**
- Status API: http://localhost:3001/api/system-status
- Health Check: http://localhost:3001/health

## 💡 Refaktor i Czysta Architektura

**Po refaktorze (FAZA 4)** główny plik `app/page.tsx` został podzielony z **305 linii** na:

### 🧩 Modularne komponenty:
- **DashboardHeader** - Nagłówek z przełącznikiem języka
- **SystemStatusCard** - Status API i bazy danych  
- **FeatureCards** - Grid funkcjonalności CMMS
- **SystemInfoCard** - Informacje o systemie
- **StatusIndicator** - Wielokrotnego użytku wskaźnik statusu
- **useSystemStatus** - Custom hook do zarządzania stanem

### 📊 Korzyści refaktoru:
- ✅ **Czytelność** - każdy komponent ma jedną odpowiedzialność
- ✅ **Maintainability** - łatwiej dodawać nowe funkcje
- ✅ **Reużywalność** - komponenty można wykorzystać ponownie
- ✅ **Testowanie** - łatwiej testować małe komponenty

## 🔧 System Automatyzacji

Projekt zawiera zaawansowany system automatycznego zarządzania procesami developmentu.

### Główne funkcje:
- ✅ **Automatyczne uruchamianie** backend + frontend
- ✅ **Rozwiązywanie konfliktów portów**
- ✅ **Cleanup procesów** przed startem
- ✅ **Testowanie endpointów** po uruchomieniu
- ✅ **Diagnostyka systemu** w czasie rzeczywistym

### Workflow developmentu:
```bash
# Rano
npm run simple:start  # Uruchom wszystko (NIEZAWODNY!)

# Podczas pracy
npm run sys:status    # Sprawdź co działa

# Wieczorem
npm run sys:stop      # Zatrzymaj wszystko
```

### Rozwiązane problemy:
- **DATABASE_URL**: ✅ **Prawidłowo skonfigurowane** - ładowane z `database.env`
- **Konflikt portów**: Automatyczne wykrywanie i rozwiązywanie
- **Niestabilne procesy**: Niezawodny system zarządzania
- **Kodowanie znaków**: Skrypty bez problemów z polskimi znakami

## 🔒 Bezpieczeństwo

- JWT dla autoryzacji
- Hashowanie haseł
- CORS skonfigurowany
- Walidacja danych wejściowych
- Role-based access control (RBAC)

## 📝 Licencja

Projekt prywatny - wszystkie prawa zastrzeżone.

## 🤝 Wsparcie

W przypadku problemów lub pytań, skontaktuj się z zespołem deweloperskim.

## 🔄 Kontynuacja Pracy z AI

Jeśli pracujesz z AI asystentem nad tym projektem:

1. **W nowej sesji napisz**: *"Przeczytaj AI_CONTEXT.md i README.md, a następnie kontynuuj pracę nad LiteCMMS"*
2. **AI automatycznie**: Załaduje pełny kontekst projektu i będzie wiedzieć co robić dalej
3. **Przed końcem sesji**: AI zaktualizuje pliki kontekstu z postępami

**Pliki kontekstu:**
- `AI_CONTEXT.md` - Pełny kontekst dla AI (stan systemu, historia, następne kroki)
- `README.md` - Dokumentacja projektu dla ludzi

---

**Ostatnia aktualizacja**: Czerwiec 2025  
**Wersja**: 2.0.0  
**Status**: Po refaktorze - Gotowy do rozwoju funkcjonalności CMMS  
**Refaktor**: ✅ Ukończony (305 linii → 6 komponentów + 1 hook) 
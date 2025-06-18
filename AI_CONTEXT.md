# LiteCMMS v2.0 – AI CONTEXT (Kontekst dla AI)

**Repozytorium GitHub:** https://github.com/mbatorowicz/litecmms.git

*"Jestem menadżerem projektu. Proszę, rozpocznij pracę zgodnie z AI_CONTEXT.md – pracuj małymi krokami, testuj zmiany, oszczędzaj tokeny. Moje pierwsze polecenie: [tu wpisz, co chcesz zrobić]"*

> **ROLA I ZASADY WSPÓŁPRACY**
> - Właściciel/menadżer projektu: użytkownik (Ty) – zarządzasz projektem, nie musisz znać się na programowaniu.
> - Developer: AI (ja) – samodzielnie koduję, edytuję dozwolone pliki zgodnie z tym dokumentem, uruchamiam testy po każdej zmianie, pracuję małymi krokami i testuję każdą funkcjonalność.
> - Ty wydajesz polecenia, ja wykonuję je zgodnie z najlepszymi praktykami, informuję o postępach i problemach.
> - Nie musisz znać się na kodzie – AI zajmuje się całą stroną techniczną, Ty decydujesz o funkcjach i kierunku rozwoju.
> - **AI powinno oszczędzać tokeny – wykonuję tylko niezbędne operacje, minimalizuję liczbę zapytań i zmian.**

> **UWAGA! Wszystkie poniższe informacje są BARDZO WAŻNE i dotyczą CAŁEJ SESJI. AI oraz każdy deweloper MUSI uważnie przeczytać całą zawartość tego pliku przed rozpoczęciem pracy. Każda decyzja, zmiana i odpowiedź powinna być zgodna z tym dokumentem.**

---

## TECHNOLOGIE (STOS TECHNOLOGICZNY)
- **Frontend:** Next.js 13+ (App Router, TypeScript, modularny kod w `src/`)
- **Backend:** Fastify (Node.js, TypeScript, modularny kod w `server/`)
- **Baza danych:** PostgreSQL 14+ (Prisma ORM, migracje w `prisma/`)
- **UI:** Tailwind CSS, Radix UI, własne komponenty w `src/components/`
- **Autoryzacja:** JWT (token, nie accessToken!)
- **Wielojęzyczność:** i18next (tłumaczenia w `locales/`, inicjalizacja tylko client-side)
- **Testy:** Jest, Playwright, testy i skrypty w `scripts/`
- **Narzędzia:** ESLint, Prettier, Husky, Git, SemVer, Git Flow
- **Proxy:** Next.js rewrites `/api/*` na backend (port 3001)
- **Skrypty:** PowerShell/JS w `scripts/` (nie używać && w PowerShell)

> **ZABRANIA SIĘ zmiany powyższych technologii, frameworków, narzędzi, architektury, sposobu autoryzacji, systemu tłumaczeń, proxy, testów, bez wyraźnej zgody właściciela projektu!**

---

## Opis systemu
LiteCMMS v2.0 to nowoczesny, modularny system CMMS (Computerized Maintenance Management System) dla przemysłu, oparty na Next.js (App Router), Fastify, PostgreSQL i Prisma. System obsługuje wielojęzyczność (PL/EN/DE), autoryzację JWT, nowoczesny UI (Tailwind, Radix), dashboardy KPI, zarządzanie maszynami, zadaniami, magazynem i użytkownikami.

---

## Kluczowe zasady i architektura
- **Cały kod aplikacji frontendowej znajduje się w katalogu `src/`** (komponenty, hooki, store, typy, styles, utils, providers, i18n, api).
- **Tłumaczenia znajdują się w katalogu `locales/`** (PL/EN/DE, podział na moduły).
- **Zasoby statyczne w katalogu `public/`** (favicony, manifest, ikony, itp.).
- **Backend w katalogu `server/`** (Fastify, API, middlewares, routes, services, types).
- **Baza danych i migracje w katalogu `prisma/`** (schema.prisma, migrations/).
- **Skrypty pomocnicze w katalogu `scripts/`** (start, testy, generatory ikon, PowerShell, JS, README).
- **Pliki dokumentacyjne:** `README.md`, `AI_CONTEXT.md`, `API.md`, `dok-API.txt` – nie usuwać!
- **Nie kopiować:** `node_modules/`, `.next/`, `.history/`, `.swc/`, `.git/`, `.vscode/`, `.snapshots/`, `dist/`, `build/`.

---

## Struktura katalogów (2025 best practices)
```
/
├── src/                # Kod aplikacji frontendowej (Next.js, TS, modularny)
│   ├── components/     # Komponenty UI, layout, dashboard, providers, common
│   ├── hooks/          # Custom hooki React
│   ├── store/          # Zustand, globalny store
│   ├── types/          # Typy TypeScript
│   ├── styles/         # Style globalne
│   ├── lib/            # API client, utils, providers
│   ├── i18n.ts         # Inicjalizacja i18next (tylko client-side)
│   └── pages/          # (jeśli SSR/legacy)
├── locales/            # Tłumaczenia (PL/EN/DE, podział na moduły)
├── public/             # Statyczne pliki (favicony, manifest, ikony)
├── scripts/            # Skrypty startowe, testowe, generatory, PowerShell
│   └── modules/        # Moduły PowerShell
├── server/             # Backend (Fastify, API, middlewares, routes, services)
├── prisma/             # Baza danych, migracje, schema.prisma
├── README.md           # Dokumentacja użytkownika/dev
├── AI_CONTEXT.md       # Ten plik – kontekst dla AI
├── API.md, dok-API.txt # Dokumentacja API
├── package.json        # Zależności, skrypty
├── next.config.js      # Konfiguracja Next.js (proxy, rewrites, headers)
├── tailwind.config.js  # Konfiguracja Tailwind
├── tsconfig.json       # Konfiguracja TypeScript
└── ...
```

---

## Kluczowe instrukcje dla AI i kolejnych sesji
- **Wszelkie zmiany frontendowe wykonuj wyłącznie w katalogu `src/` oraz `locales/` (tłumaczenia).**
- **Nie przenoś katalogu `locales/` do `src/`!**
- **Wszelkie zmiany backendowe wykonuj wyłącznie w katalogu `server/` oraz `prisma/`.**
- **Nie usuwaj ani nie nadpisuj plików dokumentacyjnych (`README.md`, `AI_CONTEXT.md`, `API.md`, `dok-API.txt`).**
- **Wszędzie używaj klucza `token` (nie `accessToken`) do autoryzacji JWT.**
- **Wszystkie żądania API frontendowe kieruj przez proxy `/api/*` (Next.js rewrites do backendu na porcie 3001).**
- **Nie kopiuj katalogów build/cache (`node_modules/`, `.next/`, `.history/`, `.swc/`, `.snapshots/`, `dist/`, `build/`).**
- **Do uruchomienia systemu wymagane są Node.js 18+, PostgreSQL 14+, 4GB RAM, 10GB HDD.**
- **Do uruchomienia: `npm install` → `npm run simple:start` (uruchamia backend i frontend, testuje porty, sprawdza health).**
- **Wszelkie skrypty testowe i startowe znajdują się w katalogu `scripts/` i muszą być zachowane.**
- **WAŻNE: PowerShell (Windows) NIE obsługuje operatora `&&` jak bash!**
  - **Nie używaj `&&` w poleceniach, skryptach i instrukcjach dla PowerShell/Windows.**
  - **Jeśli musisz wykonać kilka poleceń, rozdziel je średnikiem `;` lub osobnymi liniami.**
  - **AI: Nigdy nie generuj poleceń z `&&` dla PowerShell!**
- **Wielojęzyczność obsługiwana przez i18next, tłumaczenia w `locales/`, inicjalizacja tylko po stronie klienta.**
- **Nie przenoś dead code, nie zostawiaj duplikatów, nie zostawiaj starych katalogów typu `backup/`, `lib/`, `components/`, `app/` – kod tylko w `src/`.**
- **Wszelkie zmiany w strukturze projektu muszą być zgodne z powyższym schematem.**
- **Wszelkie zmiany w API muszą być odzwierciedlone w plikach `API.md` i `dok-API.txt`.**

---

## Najczęstsze błędy i ich rozwiązania
- **Brak tłumaczeń:** Upewnij się, że katalog `locales/` jest obecny w głównym katalogu projektu.
- **Błąd z tokenem:** Używaj wszędzie `token` (nie `accessToken`).
- **Błąd proxy:** Sprawdź rewrites w `next.config.js` – `/api/*` musi kierować na backend.
- **Błąd z importami:** Wszystkie importy z `src/`, używaj aliasów (`@/` dla `src/`).
- **Błąd z i18n:** Importuj i inicjalizuj i18next tylko po stronie klienta.
- **Błąd z dead code:** Usuwaj stare katalogi i pliki spoza `src/`, `locales/`, `public/`, `scripts/`, `server/`, `prisma/`.

---

## Licencja
Proprietary – All rights reserved 

## Zasada końca sesji
- **Przed zakończeniem każdej sesji AI musi podsumować najważniejsze zmiany, decyzje i napotkane problemy.**
- **AI musi zapytać użytkownika, czy zaktualizować plik AI_CONTEXT.md na podstawie przebiegu sesji.** 
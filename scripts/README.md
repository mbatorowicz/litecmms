# 🔧 LiteCMMS Automation Scripts

Zestaw skryptów PowerShell do automatycznego zarządzania systemem LiteCMMS podczas developmentu.

## 📋 Dostępne Skrypty

### 🚀 `system-manager.ps1` - Główny System Zarządzania (ZALECANE)
**Komendy**:
- `npm run sys:start` - Uruchom cały system
- `npm run sys:stop` - Zatrzymaj wszystkie procesy  
- `npm run sys:restart` - Restart systemu
- `npm run sys:status` - Sprawdź status

**Co robi**:
- ✅ Automatyczne zatrzymywanie starych procesów
- ✅ Sprawdzanie konfliktów portów
- ✅ Uruchamianie backend + frontend w odpowiedniej kolejności
- ✅ Testowanie wszystkich endpointów
- ✅ Kompletna diagnostyka systemu
- ✅ Obsługa błędów i fallback na inne porty

**Kiedy używać**: To jest główny system - używaj go zawsze!

---

### 🔄 `reset-system.ps1` - Pełny Reset Systemu (BACKUP)
**Komenda**: `npm run reset`

**Co robi**:
- ✅ Zatrzymuje wszystkie procesy Node.js
- ✅ Sprawdza status portów (3000, 3001, 5432)
- ✅ Weryfikuje PostgreSQL
- ✅ Czyści cache (.next, node_modules/.cache, tsconfig.tsbuildinfo)
- ✅ Uruchamia backend w tle
- ✅ Uruchamia frontend w tle
- ✅ Testuje wszystkie endpointy
- ✅ Wyświetla pełny raport

**Kiedy używać**: Gdy masz problemy z systemem lub chcesz "świeży start"

---

### ⚡ `quick-start.ps1` - Szybki Start
**Komenda**: `npm run quick-start`

**Co robi**:
- ✅ Sprawdza istniejące procesy Node.js
- ✅ Opcjonalnie zatrzymuje stare procesy
- ✅ Uruchamia backend i frontend
- ✅ Wykonuje podstawowe testy

**Kiedy używać**: Codzienne uruchamianie systemu

---

### 🛑 `stop-all.ps1` - Zatrzymaj Wszystko
**Komenda**: `npm run stop-all`

**Co robi**:
- ✅ Zatrzymuje wszystkie procesy Node.js
- ✅ Czyści PowerShell Jobs
- ✅ Sprawdza czy porty są wolne

**Kiedy używać**: Gdy chcesz zatrzymać cały system

---

### 📊 `status-check.ps1` - Sprawdź Status
**Komenda**: `npm run status`

**Co robi**:
- ✅ Pokazuje działające procesy Node.js
- ✅ Sprawdza status portów
- ✅ Testuje PostgreSQL Service
- ✅ Testuje wszystkie endpointy API
- ✅ Sprawdza PowerShell Jobs

**Kiedy używać**: Gdy chcesz sprawdzić co działa

## 🚀 Przykłady Użycia

### Typowy workflow developmentu:

**ZALECANY (nowy system):**
```powershell
# Rano - uruchom system
npm run sys:start

# Sprawdź czy wszystko działa
npm run sys:status

# Podczas pracy - jeśli coś nie gra
npm run sys:restart

# Na koniec dnia
npm run sys:stop
```

**BACKUP (stary system):**
```powershell
# Rano - uruchom system
npm run quick-start

# Sprawdź czy wszystko działa
npm run status

# Podczas pracy - jeśli coś nie gra
npm run reset

# Na koniec dnia
npm run stop-all
```

### Rozwiązywanie problemów:

```powershell
# Problem z backendem/frontendem
npm run stop-all
npm run reset

# Sprawdź szczegóły
npm run status

# Jeśli nadal problemy - uruchom ręcznie
npm run dev:server  # w jednym terminalu
npm run dev         # w drugim terminalu
```

## 🔧 Wymagania

- **PowerShell 5.0+** (Windows 10/11 ma to domyślnie)
- **Node.js 18+**
- **PostgreSQL** zainstalowany i działający

## 📝 Logi i Diagnostyka

Wszystkie skrypty wyświetlają kolorowe logi:
- 🟢 **Zielony** - Sukces
- 🔴 **Czerwony** - Błąd
- 🟡 **Żółty** - Ostrzeżenie/Info
- 🔵 **Niebieski** - Informacja
- ⚪ **Szary** - Szczegóły

## 🛠️ Customizacja

Możesz edytować skrypty w katalogu `scripts/` aby dostosować je do swoich potrzeb:

- **Porty**: Zmień tablicę `$ports` w skryptach
- **Timeouty**: Dostosuj wartości `Start-Sleep` i `-TimeoutSec`
- **Endpointy**: Dodaj nowe testy w funkcji `Test-System`

## 🔒 Bezpieczeństwo

Skrypty używają `-ExecutionPolicy Bypass` tylko dla konkretnych plików. To bezpieczne rozwiązanie które nie zmienia globalnych ustawień PowerShell.

## ✅ Rozwiązane Problemy

### 1. Problem DATABASE_URL
**Problem**: Brak pliku `.env`  
**Rozwiązanie**: Backend używa `database.env` + hardkodowany fallback
```javascript
// W server/index.ts:
dotenv.config({ path: 'database.env' });
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://postgres:8C5c3Aab5@localhost:5432/litecmms?schema=public";
}
```

### 2. Konflikt portów
**Rozwiązanie**: System automatycznie sprawdza porty przed uruchomieniem
- Backend zawsze na porcie 3001
- Frontend na porcie 3000 (lub fallback na 3001)

### 3. Niestabilne procesy
**Rozwiązanie**: Nowy `system-manager.ps1` z:
- Podwójnym cleanup (taskkill + Get-Process)
- Retry logic dla testów
- Proper error handling

### 4. Kodowanie znaków
**Rozwiązanie**: Wszystkie skrypty bez polskich znaków specjalnych

## 🐛 Troubleshooting

### Problem: "Execution Policy"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problem: "Port zajęty"
```powershell
npm run sys:stop
npm run sys:start
```

### Problem: "PostgreSQL nie odpowiada"
1. Sprawdź Windows Services
2. Uruchom PostgreSQL ręcznie
3. Sprawdź hasło w `database.env`

---

**💡 Tip**: Dodaj alias w PowerShell Profile dla częściej używanych komend:
```powershell
Set-Alias -Name "cms-start" -Value "npm run quick-start"
Set-Alias -Name "cms-stop" -Value "npm run stop-all"
Set-Alias -Name "cms-status" -Value "npm run status"
``` 
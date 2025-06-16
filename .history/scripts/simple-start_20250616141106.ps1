# Simple LiteCMMS Starter
# Naprawiony problem z wykrywaniem portow

Write-Host "=== SIMPLE LITECMMS STARTER ===" -ForegroundColor Cyan

# AGRESYWNE czyszczenie - FRONTEND ZAWSZE PORT 3000!
Write-Host "Zatrzymywanie starych procesow..." -ForegroundColor Yellow

# Metoda 1: Zabij wszystkie Node.js
taskkill /F /IM node.exe 2>$null | Out-Null
taskkill /F /IM nodemon.exe 2>$null | Out-Null

# Metoda 2: Zabij procesy na konkretnych portach
Write-Host "Czyszczenie portow 3000 i 3001..." -ForegroundColor Yellow

# Port 3000 (Frontend) - MUSI BYC WOLNY!
$port3000 = netstat -ano | findstr :3000 | findstr LISTENING
if ($port3000) {
    $pid3000 = ($port3000 -split '\s+')[-1]
    Write-Host "Zabijam proces na porcie 3000 (PID: $pid3000)" -ForegroundColor Red
    taskkill /F /PID $pid3000 2>$null
}

# Port 3001 (Backend)
$port3001 = netstat -ano | findstr :3001 | findstr LISTENING
if ($port3001) {
    $pid3001 = ($port3001 -split '\s+')[-1]
    Write-Host "Zabijam proces na porcie 3001 (PID: $pid3001)" -ForegroundColor Red
    taskkill /F /PID $pid3001 2>$null
}

Start-Sleep -Seconds 3

# Start Backend
Write-Host "Uruchamianie Backend (port 3001)..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev:server" -WindowStyle Normal

# Wait
Write-Host "Czekam 8 sekund..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Start Frontend
Write-Host "Uruchamianie Frontend (port 3000)..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal

Write-Host "Czekam 15 sekund na uruchomienie..." -ForegroundColor Gray
Start-Sleep -Seconds 15

# Test
Write-Host "Testowanie systemu..." -ForegroundColor Yellow

try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
    Write-Host "✅ Backend OK: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend nie odpowiada" -ForegroundColor Red
}

# Test frontend - TYLKO PORT 3000!
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "✅ Frontend OK na porcie 3000" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend nie odpowiada na porcie 3000!" -ForegroundColor Red
    Write-Host "    SPRAWDŹ okno terminala z frontend!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== SYSTEM URUCHOMIONY ===" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:3001" -ForegroundColor Cyan  
Write-Host "❤️  Health:   http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  UWAGA: Frontend ZAWSZE na porcie 3000!" -ForegroundColor Yellow 
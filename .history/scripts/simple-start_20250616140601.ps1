# Simple LiteCMMS Starter
# Naprawiony problem z wykrywaniem portow

Write-Host "=== SIMPLE LITECMMS STARTER ===" -ForegroundColor Cyan

# Kill existing processes
Write-Host "Zatrzymywanie starych procesow..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null
taskkill /F /IM nodemon.exe 2>$null | Out-Null

Start-Sleep -Seconds 2

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

# Test frontend na różnych portach
$frontendPorts = @(3000, 3002, 3003)
$frontendOK = $false

foreach ($port in $frontendPorts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port" -TimeoutSec 3
        Write-Host "✅ Frontend OK na porcie $port" -ForegroundColor Green
        $frontendOK = $true
        break
    } catch {
        continue
    }
}

if (-not $frontendOK) {
    Write-Host "❌ Frontend nie odpowiada na portach 3000, 3002, 3003" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== SYSTEM URUCHOMIONY ===" -ForegroundColor Green
Write-Host "Backend: http://localhost:3001" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000 (lub auto-port)" -ForegroundColor White
Write-Host "Health: http://localhost:3001/health" -ForegroundColor White 
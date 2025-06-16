# LiteCMMS Quick Start Script - Simple Version
# Szybkie uruchomienie systemu

Write-Host "LiteCMMS Quick Start" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

# Zatrzymaj istniejace procesy
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Zatrzymywanie istniejacych procesow..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "Procesy zatrzymane" -ForegroundColor Green
}

# Uruchom backend
Write-Host "Uruchamianie backendu..." -ForegroundColor Yellow
Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev:server
} | Out-Null

Start-Sleep -Seconds 5

# Uruchom frontend
Write-Host "Uruchamianie frontendu..." -ForegroundColor Yellow
Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
} | Out-Null

Write-Host "Czekam na uruchomienie..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Test backendu
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
    Write-Host "Backend: OK - $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "Backend: BLAD - nie odpowiada" -ForegroundColor Red
}

# Test frontendu
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
    Write-Host "Frontend: OK - HTTP $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Frontend: BLAD - nie odpowiada" -ForegroundColor Red
}

Write-Host ""
Write-Host "Dostepne adresy:" -ForegroundColor Cyan
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:   http://localhost:3001" -ForegroundColor White
Write-Host "  API Test:  http://localhost:3001/health" -ForegroundColor White 
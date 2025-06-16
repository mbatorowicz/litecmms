#!/usr/bin/env pwsh
# LiteCMMS Quick Start Script
# Szybkie uruchomienie systemu bez pełnego resetu

Write-Host "⚡ LiteCMMS Quick Start" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

# Sprawdź czy procesy już działają
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "ℹ️  Znaleziono działające procesy Node.js:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "   PID: $($_.Id)" -ForegroundColor Gray
    }
    
    $choice = Read-Host "Czy zatrzymać istniejące procesy? (y/N)"
    if ($choice -eq "y" -or $choice -eq "Y") {
        $nodeProcesses | Stop-Process -Force
        Write-Host "✅ Procesy zatrzymane" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

# Uruchom backend
Write-Host "🚀 Uruchamianie backendu..." -ForegroundColor Yellow
Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev:server
} | Out-Null

Start-Sleep -Seconds 3

# Uruchom frontend
Write-Host "🌐 Uruchamianie frontendu..." -ForegroundColor Yellow
Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
} | Out-Null

Write-Host "⏳ Czekam na uruchomienie..." -ForegroundColor Gray
Start-Sleep -Seconds 8

# Test
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
    Write-Host "✅ Backend: $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend nie odpowiada" -ForegroundColor Red
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
    Write-Host "✅ Frontend: HTTP $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend nie odpowiada" -ForegroundColor Red
}

Write-Host ""
Write-Host "🌐 Dostępne adresy:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000 - Frontend" -ForegroundColor White
Write-Host "   http://localhost:3001 - Backend API" -ForegroundColor White 
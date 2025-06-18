#!/usr/bin/env pwsh
# LiteCMMS System Reset Script
# Automatycznie resetuje i uruchamia cały system

Write-Host "🔄 LiteCMMS System Reset Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Funkcja do zabijania procesów Node.js
function Stop-NodeProcesses {
    Write-Host "🛑 Zatrzymywanie procesów Node.js..." -ForegroundColor Yellow
    try {
        $processes = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($processes) {
            $processes | ForEach-Object {
                Write-Host "   Zabijam proces Node.js PID: $($_.Id)" -ForegroundColor Gray
                Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Seconds 2
            Write-Host "✅ Procesy Node.js zatrzymane" -ForegroundColor Green
        } else {
            Write-Host "ℹ️  Brak procesów Node.js do zatrzymania" -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️  Błąd podczas zatrzymywania procesów: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Funkcja do sprawdzania portów
function Test-Ports {
    Write-Host "🔍 Sprawdzanie portów..." -ForegroundColor Yellow
    
    $ports = @(3000, 3001, 5432)
    foreach ($port in $ports) {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "   Port $port: 🟢 ZAJĘTY" -ForegroundColor Green
        } else {
            Write-Host "   Port $port: 🔴 WOLNY" -ForegroundColor Red
        }
    }
}

# Funkcja do sprawdzania PostgreSQL
function Test-PostgreSQL {
    Write-Host "🐘 Sprawdzanie PostgreSQL..." -ForegroundColor Yellow
    
    $pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
    if ($pgService) {
        $status = $pgService.Status
        Write-Host "   PostgreSQL Service: $status" -ForegroundColor $(if ($status -eq "Running") { "Green" } else { "Red" })
    } else {
        Write-Host "   PostgreSQL Service: NIE ZNALEZIONO" -ForegroundColor Red
    }
    
    # Test połączenia z portem 5432
    $pgConnection = Test-NetConnection -ComputerName "localhost" -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($pgConnection) {
        Write-Host "   PostgreSQL Port 5432: 🟢 DOSTĘPNY" -ForegroundColor Green
    } else {
        Write-Host "   PostgreSQL Port 5432: 🔴 NIEDOSTĘPNY" -ForegroundColor Red
    }
}

# Funkcja do czyszczenia cache
function Clear-Cache {
    Write-Host "🧹 Czyszczenie cache..." -ForegroundColor Yellow
    
    # Next.js cache
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Usunięto .next cache" -ForegroundColor Green
    }
    
    # Node modules cache
    if (Test-Path "node_modules/.cache") {
        Remove-Item "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Usunięto node_modules cache" -ForegroundColor Green
    }
    
    # TypeScript build info
    if (Test-Path "tsconfig.tsbuildinfo") {
        Remove-Item "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue
        Write-Host "   ✅ Usunięto TypeScript build info" -ForegroundColor Green
    }
}

# Funkcja do uruchamiania backendu API (monorepo)
function Start-Backend {
    Write-Host "🚀 Uruchamianie Backend API (apps/api)..." -ForegroundColor Yellow
    
    # Sprawdź pnpm
    try {
        $pnpmVersion = pnpm --version
        Write-Host "   Używam pnpm $pnpmVersion" -ForegroundColor Cyan
    } catch {
        Write-Host "   ❌ pnpm nie jest zainstalowany!" -ForegroundColor Red
        return $false
    }
    
    # Uruchom backend API w tle
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        pnpm --filter api dev
    }
    
    Write-Host "   Backend uruchomiony w tle (Job ID: $($backendJob.Id))" -ForegroundColor Green
    
    # Czekaj na uruchomienie
    Write-Host "   Czekam 5 sekund na uruchomienie..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
    
    # Test endpointu
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
        Write-Host "   ✅ Backend odpowiada: $($response.message)" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "   ❌ Backend nie odpowiada: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funkcja do uruchamiania frontendu Web (monorepo)
function Start-Frontend {
    Write-Host "🌐 Uruchamianie Frontend Web (apps/web)..." -ForegroundColor Yellow
    
    # Uruchom frontend Web w tle
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        pnpm --filter web dev
    }
    
    Write-Host "   Frontend uruchomiony w tle (Job ID: $($frontendJob.Id))" -ForegroundColor Green
    
    # Czekaj na uruchomienie
    Write-Host "   Czekam 10 sekund na uruchomienie..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
    
    # Test frontendu
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ Frontend odpowiada (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "   ❌ Frontend nie odpowiada: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funkcja do testowania systemu
function Test-System {
    Write-Host "🧪 Testowanie systemu..." -ForegroundColor Yellow
    
    $tests = @()
    
    # Test backendu
    try {
        $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
        $tests += @{ Name = "Backend Health"; Status = "✅ PASS"; Details = $healthResponse.message }
    } catch {
        $tests += @{ Name = "Backend Health"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    }
    
    # Test API Status
    try {
        $apiResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/status" -TimeoutSec 5
        $tests += @{ Name = "API Status"; Status = "✅ PASS"; Details = $apiResponse.status }
    } catch {
        $tests += @{ Name = "API Status"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    }
    
    # Test System Status
    try {
        $systemResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/system-status" -TimeoutSec 5
        $dbStatus = $systemResponse.database.status
        $tests += @{ Name = "System Status"; Status = "✅ PASS"; Details = "DB: $dbStatus" }
    } catch {
        $tests += @{ Name = "System Status"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    }
    
    # Test frontendu
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
        $tests += @{ Name = "Frontend"; Status = "✅ PASS"; Details = "HTTP $($frontendResponse.StatusCode)" }
    } catch {
        $tests += @{ Name = "Frontend"; Status = "❌ FAIL"; Details = $_.Exception.Message }
    }
    
    # Wyświetl wyniki
    Write-Host ""
    Write-Host "📊 Wyniki testów:" -ForegroundColor Cyan
    foreach ($test in $tests) {
        Write-Host "   $($test.Name): $($test.Status) - $($test.Details)" -ForegroundColor $(if ($test.Status -like "*PASS*") { "Green" } else { "Red" })
    }
}

# GŁÓWNY SKRYPT
Write-Host ""
Write-Host "🔄 Rozpoczynam reset systemu..." -ForegroundColor Cyan

# 1. Zatrzymaj procesy
Stop-NodeProcesses

# 2. Sprawdź porty
Test-Ports

# 3. Sprawdź PostgreSQL
Test-PostgreSQL

# 4. Wyczyść cache
Clear-Cache

Write-Host ""
Write-Host "🚀 Uruchamianie systemu..." -ForegroundColor Cyan

# 5. Uruchom backend
$backendOk = Start-Backend

if ($backendOk) {
    # 6. Uruchom frontend
    $frontendOk = Start-Frontend
    
    if ($frontendOk) {
        Write-Host ""
        Write-Host "✅ System uruchomiony pomyślnie!" -ForegroundColor Green
        
        # 7. Testuj system
        Test-System
        
        Write-Host ""
        Write-Host "🌐 Dostępne endpointy:" -ForegroundColor Cyan
        Write-Host "   Frontend:      http://localhost:3000" -ForegroundColor White
        Write-Host "   Backend API:   http://localhost:3001" -ForegroundColor White
        Write-Host "   Health Check:  http://localhost:3001/health" -ForegroundColor White
        Write-Host "   System Status: http://localhost:3001/api/system-status" -ForegroundColor White
        
    } else {
        Write-Host "❌ Błąd uruchamiania frontendu" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Błąd uruchamiania backendu" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔄 Reset systemu zakończony" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan 
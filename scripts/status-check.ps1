#!/usr/bin/env pwsh
# LiteCMMS Status Check Script
# Sprawdza status wszystkich komponentow systemu

Write-Host "LiteCMMS Status Check" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

# Sprawdz procesy Node.js
Write-Host "Procesy Node.js:" -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "   PID: $($_.Id) | CPU: $($_.CPU) | Memory: $([math]::Round($_.WorkingSet64/1MB, 2)) MB" -ForegroundColor Green
    }
} else {
    Write-Host "   Brak procesow Node.js" -ForegroundColor Red
}

# Sprawdz porty
Write-Host ""
Write-Host "Status portow:" -ForegroundColor Yellow
$ports = @(
    @{Port=3000; Name="Frontend (Next.js)"},
    @{Port=3001; Name="Backend (Fastify)"},
    @{Port=5432; Name="PostgreSQL"}
)

foreach ($portInfo in $ports) {
    $connection = Test-NetConnection -ComputerName "localhost" -Port $portInfo.Port -InformationLevel Quiet -WarningAction SilentlyContinue
    $status = if ($connection) { "POLACZONY" } else { "NIEDOSTEPNY" }
    $color = if ($connection) { "Green" } else { "Red" }
    Write-Host "   Port $($portInfo.Port) ($($portInfo.Name)): $status" -ForegroundColor $color
}

# Sprawdz PostgreSQL Service
Write-Host ""
Write-Host "PostgreSQL Service:" -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($pgService) {
    $status = $pgService.Status
    $color = if ($status -eq "Running") { "Green" } else { "Red" }
    Write-Host "   Service: $status" -ForegroundColor $color
} else {
    Write-Host "   Service nie znaleziony" -ForegroundColor Red
}

# Test endpointow
Write-Host ""
Write-Host "Test endpointow:" -ForegroundColor Yellow

# Backend Health
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 3
    Write-Host "   Backend Health: OK - $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "   Backend Health: BLAD - Niedostepny" -ForegroundColor Red
}

# Backend API Status
try {
    $api = Invoke-RestMethod -Uri "http://localhost:3001/api/status" -TimeoutSec 3
    Write-Host "   API Status: OK - $($api.status)" -ForegroundColor Green
} catch {
    Write-Host "   API Status: BLAD - Niedostepny" -ForegroundColor Red
}

# System Status
try {
    $system = Invoke-RestMethod -Uri "http://localhost:3001/api/system-status" -TimeoutSec 3
    $dbStatus = $system.database.status
    $dbColor = if ($dbStatus -eq "ok") { "Green" } else { "Yellow" }
    Write-Host "   System Status: OK - API OK, DB: $dbStatus" -ForegroundColor $dbColor
} catch {
    Write-Host "   System Status: BLAD - Niedostepny" -ForegroundColor Red
}

# Frontend
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
    Write-Host "   Frontend: OK - HTTP $($frontend.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   Frontend: BLAD - Niedostepny" -ForegroundColor Red
}

# PowerShell Jobs
Write-Host ""
Write-Host "PowerShell Jobs:" -ForegroundColor Yellow
$jobs = Get-Job -ErrorAction SilentlyContinue
if ($jobs) {
    $jobs | ForEach-Object {
        $color = switch ($_.State) {
            "Running" { "Green" }
            "Completed" { "Blue" }
            "Failed" { "Red" }
            default { "Yellow" }
        }
        Write-Host "   Job $($_.Id): $($_.Name) - $($_.State)" -ForegroundColor $color
    }
} else {
    Write-Host "   Brak aktywnych Jobs" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Status check zakonczony" -ForegroundColor Cyan 
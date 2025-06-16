#!/usr/bin/env pwsh
# LiteCMMS Stop All Script
# Zatrzymuje wszystkie procesy systemu

Write-Host "LiteCMMS Stop All" -ForegroundColor Red
Write-Host "=================" -ForegroundColor Red

# Zatrzymaj procesy Node.js
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Zatrzymywanie procesow Node.js..." -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "   Zabijam PID: $($_.Id)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Procesy Node.js zatrzymane" -ForegroundColor Green
} else {
    Write-Host "Brak procesow Node.js do zatrzymania" -ForegroundColor Gray
}

# Zatrzymaj PowerShell Jobs
$jobs = Get-Job -ErrorAction SilentlyContinue
if ($jobs) {
    Write-Host "Zatrzymywanie PowerShell Jobs..." -ForegroundColor Yellow
    $jobs | ForEach-Object {
        Write-Host "   Zatrzymuję Job: $($_.Name) (ID: $($_.Id))" -ForegroundColor Gray
        Stop-Job -Id $_.Id -ErrorAction SilentlyContinue
        Remove-Job -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "PowerShell Jobs zatrzymane" -ForegroundColor Green
} else {
    Write-Host "Brak PowerShell Jobs do zatrzymania" -ForegroundColor Gray
}

# Sprawdź porty
Write-Host "Sprawdzanie portow..." -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName "localhost" -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($connection) {
        Write-Host "   Port $port NADAL ZAJETY" -ForegroundColor Red
    } else {
        Write-Host "   Port $port WOLNY" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Wszystkie procesy zatrzymane" -ForegroundColor Green 
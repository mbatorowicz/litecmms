# LiteCMMS System Manager v2.0 - ZREFAKTORYZOWANY
# Modularny skrypt zarządzania systemem

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action
)

# Import modułów
$ModulePath = Join-Path $PSScriptRoot "modules"
Import-Module (Join-Path $ModulePath "ProcessManager.psm1") -Force
Import-Module (Join-Path $ModulePath "PortTester.psm1") -Force
Import-Module (Join-Path $ModulePath "ServiceStarter.psm1") -Force
Import-Module (Join-Path $ModulePath "SystemTester.psm1") -Force

# Nagłówek
Write-Host "=== LiteCMMS System Manager v2.0 ===" -ForegroundColor Cyan
Write-Host "Akcja: $Action" -ForegroundColor Yellow
Write-Host "Wersja: ZREFAKTORYZOWANA (modułowa)" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan

# Główna logika - ZNACZNIE PROSTSZA!
switch ($Action) {
    "stop" {
        Write-Host ""
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Test-SystemPorts
        Write-Host "System zatrzymany" -ForegroundColor Green
    }
    
    "start" {
        Write-Host ""
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Test-SystemPorts
        
        Write-Host ""
        Write-Host "=== URUCHAMIANIE SYSTEMU ===" -ForegroundColor Cyan
        
        $backendOk = Start-Backend
        if ($backendOk) {
            $frontendOk = Start-Frontend
            if ($frontendOk) {
                Write-Host ""
                Test-SystemStatus
                Write-Host ""
                Write-Host "=== SYSTEM URUCHOMIONY ===" -ForegroundColor Green
                Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
                Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
                Write-Host "Health:   http://localhost:3001/health" -ForegroundColor White
                Write-Host "Status:   http://localhost:3001/api/system-status" -ForegroundColor White
                Write-Host ""
                Write-Host "UWAGA: Frontend ZAWSZE na porcie 3000!" -ForegroundColor Yellow
            } else {
                Write-Host "BŁĄD: Frontend nie uruchomił się poprawnie" -ForegroundColor Red
            }
        } else {
            Write-Host "BŁĄD: Backend nie uruchomił się poprawnie" -ForegroundColor Red
        }
    }
    
    "restart" {
        Write-Host ""
        Write-Host "=== RESTART SYSTEMU ===" -ForegroundColor Yellow
        
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Start-Sleep -Seconds 2
        
        Test-SystemPorts
        $backendOk = Start-Backend
        if ($backendOk) {
            $frontendOk = Start-Frontend
            if ($frontendOk) {
                Test-SystemStatus
                Write-Host "=== RESTART ZAKOŃCZONY ===" -ForegroundColor Green
            }
        }
    }
    
    "status" {
        Write-Host ""
        Test-SystemPorts
        Write-Host ""
        Test-SystemStatus
        Show-PowerShellJobs
    }
}

Write-Host ""
Write-Host "=== KONIEC SYSTEM MANAGER v2.0 ===" -ForegroundColor Cyan 
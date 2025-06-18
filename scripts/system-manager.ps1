# LiteCMMS System Manager v2.0 - REFACTORED
# Modular system management script

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action
)

# Import modules
$ModulePath = Join-Path $PSScriptRoot "modules"
Import-Module (Join-Path $ModulePath "ProcessManager.psm1") -Force
Import-Module (Join-Path $ModulePath "SmartPortManager.psm1") -Force
Import-Module (Join-Path $ModulePath "SystemTester.psm1") -Force

# Header
Write-Host "=== LiteCMMS System Manager v2.0 ===" -ForegroundColor Cyan
Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host "Version: REFACTORED (modular)" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan

# Main logic
switch ($Action) {
    "stop" {
        Write-Host ""
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Show-PortStatus
        Write-Host "System stopped" -ForegroundColor Green
    }
    
    "start" {
        Write-Host ""
        Write-Host "=== STARTING SYSTEM ===" -ForegroundColor Cyan
        Write-Host "Note: Use 'pnpm start' for dual terminal mode (recommended)" -ForegroundColor Yellow
        Write-Host "This single terminal mode is for compatibility only" -ForegroundColor Gray
        Write-Host ""
        
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Show-PortStatus
        
        Write-Host "Please use 'pnpm start' for better experience" -ForegroundColor Yellow
    }
    
    "restart" {
        Write-Host ""
        Write-Host "=== RESTARTING SYSTEM ===" -ForegroundColor Yellow
        
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Start-Sleep -Seconds 2
        
        Show-PortStatus
        Write-Host "Use 'pnpm start' to start system in dual terminal mode" -ForegroundColor Yellow
    }
    
    "status" {
        Write-Host ""
        Show-PortStatus
        Write-Host ""
        Test-SystemStatus
        Show-PowerShellJobs
    }
}

Write-Host ""
Write-Host "=== SYSTEM MANAGER v2.0 FINISHED ===" -ForegroundColor Cyan
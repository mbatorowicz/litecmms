# LiteCMMS Dual Terminal Stopper v1.0
# Stop Frontend + Backend from dual terminal starter

# Import modules
$ModulePath = Join-Path $PSScriptRoot "modules"
Import-Module (Join-Path $ModulePath "ProcessManager.psm1") -Force
Import-Module (Join-Path $ModulePath "SmartPortManager.psm1") -Force

# Header
Write-Host "=== LiteCMMS DUAL TERMINAL STOPPER ===" -ForegroundColor Red
Write-Host "Stopping all processes..." -ForegroundColor Red
Write-Host ""

# Check current status
Write-Host "Status before stopping:" -ForegroundColor Yellow
Show-PortStatus

# Stop all Node.js processes
Write-Host "Stopping processes..." -ForegroundColor Yellow
Stop-AllNodeProcesses

# Clear system ports
Write-Host "Clearing ports..." -ForegroundColor Yellow
Clear-SystemPorts

# Clear PowerShell Jobs
Write-Host "Cleaning PowerShell Jobs..." -ForegroundColor Yellow
Clear-PowerShellJobs

Write-Host ""

# Check final status
Write-Host "Status after stopping:" -ForegroundColor Yellow
Show-PortStatus

Write-Host ""
Write-Host "All processes have been stopped!" -ForegroundColor Green
Write-Host "Ports 3000 and 3001 should now be free" -ForegroundColor Gray 
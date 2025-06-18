# LiteCMMS Dual Terminal Status Checker v1.0
# Status check for Frontend + Backend

# Import modules
$ModulePath = Join-Path $PSScriptRoot "modules"
Import-Module (Join-Path $ModulePath "SmartPortManager.psm1") -Force

# Header
Write-Host "=== LiteCMMS STATUS CHECKER ===" -ForegroundColor Cyan
Write-Host "Checking system status..." -ForegroundColor Yellow
Write-Host ""

# Check ports
Show-PortStatus

# Check Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
$nodemonProcesses = Get-Process -Name "nodemon" -ErrorAction SilentlyContinue

Write-Host "NODE.JS PROCESSES:" -ForegroundColor Yellow
if ($nodeProcesses) {
    foreach ($proc in $nodeProcesses) {
        $cpuUsage = [math]::Round($proc.CPU, 2)
        $memoryMB = [math]::Round($proc.WorkingSet64 / 1MB, 0)
        Write-Host "  Node.js PID $($proc.Id): CPU ${cpuUsage}s, RAM ${memoryMB}MB" -ForegroundColor Green
    }
} else {
    Write-Host "  No Node.js processes found" -ForegroundColor Red
}

if ($nodemonProcesses) {
    foreach ($proc in $nodemonProcesses) {
        Write-Host "  Nodemon PID $($proc.Id)" -ForegroundColor Green
    }
}

Write-Host ""

# Test endpoints
Write-Host "ENDPOINT TESTS:" -ForegroundColor Yellow

# Test backend
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($healthCheck) {
        Write-Host "  Backend: $($healthCheck.message)" -ForegroundColor Green
    }
} catch {
    Write-Host "  Backend: Not responding" -ForegroundColor Red
}

# Test API status
try {
    $apiStatus = Invoke-RestMethod -Uri "http://localhost:3001/api/status" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($apiStatus) {
        Write-Host "  API Status: OK" -ForegroundColor Green
    }
} catch {
    Write-Host "  API Status: Not responding" -ForegroundColor Red
}

# Test frontend
try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "  Frontend: HTTP $($frontendCheck.StatusCode)" -ForegroundColor Green
    }
} catch {
    Write-Host "  Frontend: Not responding" -ForegroundColor Red
}

Write-Host ""

# Count working components
$workingComponents = 0
$totalComponents = 3

if ((Test-PortOccupied -Port 3001)) { $workingComponents++ }
if ((Test-PortOccupied -Port 3000)) { $workingComponents++ }
if ((Test-PortOccupied -Port 5432)) { $workingComponents++ }

# Summary
if ($workingComponents -eq $totalComponents) {
    Write-Host "SYSTEM FULLY OPERATIONAL ($workingComponents/$totalComponents)" -ForegroundColor Green
} elseif ($workingComponents -gt 0) {
    Write-Host "SYSTEM PARTIALLY OPERATIONAL ($workingComponents/$totalComponents)" -ForegroundColor Yellow
} else {
    Write-Host "SYSTEM NOT OPERATIONAL ($workingComponents/$totalComponents)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Use './start-dual.ps1' to start system" -ForegroundColor Gray
Write-Host "Use './stop-dual.ps1' to stop system" -ForegroundColor Gray
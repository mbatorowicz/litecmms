# LiteCMMS Dual Terminal Starter v1.0
# Start Frontend + Backend in separate terminals

param(
    [switch]$SkipPortCheck,
    [switch]$SkipPostgreSQL,
    [int]$WaitTimeout = 90
)

# Import modules
$ModulePath = Join-Path $PSScriptRoot "modules"
Import-Module (Join-Path $ModulePath "ProcessManager.psm1") -Force
Import-Module (Join-Path $ModulePath "SmartPortManager.psm1") -Force
Import-Module (Join-Path $ModulePath "TerminalManager.psm1") -Force
Import-Module (Join-Path $ModulePath "SystemTester.psm1") -Force

# Header
Write-Host "=== LiteCMMS DUAL TERMINAL STARTER v1.0 ===" -ForegroundColor Cyan
Write-Host "Starting Frontend + Backend in separate terminals" -ForegroundColor Cyan
Write-Host ""

# Check if we are in the correct directory
if (-not (Test-Path "apps\api") -or -not (Test-Path "apps\web")) {
    Write-Host "ERROR: Cannot find apps\api or apps\web folders" -ForegroundColor Red
    Write-Host "Run script from LiteCMMS root directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "Working directory: $PWD" -ForegroundColor Gray
Write-Host ""

# STEP 1: Check and clear ports
if (-not $SkipPortCheck) {
    Write-Host "STEP 1: Checking and clearing ports..." -ForegroundColor Yellow
    Show-PortStatus
    
    $portsCleared = Clear-SystemPorts
    if (-not $portsCleared) {
        Write-Host "Some ports may still be occupied. Continue? (y/n): " -ForegroundColor Yellow -NoNewline
        $continue = Read-Host
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "Cancelled by user" -ForegroundColor Red
            exit 1
        }
    }
} else {
    Write-Host "STEP 1: Port checking skipped (--SkipPortCheck)" -ForegroundColor Gray
}

Write-Host ""

# STEP 2: Check PostgreSQL (optional)
if (-not $SkipPostgreSQL) {
    Write-Host "STEP 2: Checking PostgreSQL..." -ForegroundColor Yellow
    
    $pgRunning = Test-PortOccupied -Port 5432
    if ($pgRunning) {
        Write-Host "PostgreSQL is running (port 5432)" -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL not responding on port 5432" -ForegroundColor Yellow
        Write-Host "Backend may have database connection problems" -ForegroundColor Gray
    }
} else {
    Write-Host "STEP 2: PostgreSQL check skipped (--SkipPostgreSQL)" -ForegroundColor Gray
}

Write-Host ""

# STEP 3: Start backend in new terminal
Write-Host "STEP 3: Starting backend..." -ForegroundColor Yellow
$backendStarted = Start-BackendTerminal -ProjectRoot $PWD.Path

if (-not $backendStarted) {
    Write-Host "ERROR: Failed to start backend" -ForegroundColor Red
    exit 1
}

Write-Host ""

# STEP 4: Wait a moment before starting frontend
Write-Host "Waiting 5 seconds before starting frontend..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# STEP 5: Start frontend in new terminal
Write-Host "STEP 4: Starting frontend..." -ForegroundColor Yellow
$frontendStarted = Start-FrontendTerminal -ProjectRoot $PWD.Path

if (-not $frontendStarted) {
    Write-Host "ERROR: Failed to start frontend" -ForegroundColor Red
    Write-Host "Backend is still running in its terminal" -ForegroundColor Gray
    exit 1
}

Write-Host ""

# STEP 6: Wait for processes to start
Write-Host "STEP 5: Waiting for processes to start..." -ForegroundColor Yellow
$processesStarted = Wait-ForProcesses -TimeoutSeconds $WaitTimeout

Write-Host ""

# STEP 7: Check final status
Write-Host "STEP 6: Checking final status..." -ForegroundColor Yellow
Show-PortStatus

# Test endpoints (optional)
Write-Host "Testing endpoints..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 10 -ErrorAction SilentlyContinue
    if ($healthCheck) {
        Write-Host "Backend responding: $($healthCheck.message)" -ForegroundColor Green
    } else {
        Write-Host "Backend not responding to health check" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Backend not responding to health check" -ForegroundColor Yellow
}

try {
    $frontendCheck = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 15 -ErrorAction SilentlyContinue
    if ($frontendCheck.StatusCode -eq 200) {
        Write-Host "Frontend responding (HTTP $($frontendCheck.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "Frontend not responding correctly" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend not responding" -ForegroundColor Yellow
}

Write-Host ""

# Summary
Write-Host "=== SYSTEM STARTED ===" -ForegroundColor Green
Write-Host "Frontend:    http://localhost:3000" -ForegroundColor White
Write-Host "Backend:     http://localhost:3001" -ForegroundColor White
Write-Host "Health:      http://localhost:3001/health" -ForegroundColor White
Write-Host "API Status:  http://localhost:3001/api/status" -ForegroundColor White
Write-Host ""
Write-Host "Frontend and Backend are running in separate terminals" -ForegroundColor Yellow
Write-Host "Close terminals to stop system" -ForegroundColor Yellow
Write-Host "Use 'pnpm sys:stop' to stop all processes" -ForegroundColor Yellow
Write-Host ""
Write-Host "System ready! Happy development!" -ForegroundColor Cyan 
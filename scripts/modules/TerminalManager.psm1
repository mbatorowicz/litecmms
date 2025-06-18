# LiteCMMS Terminal Manager Module
# Managing multiple terminals for frontend/backend

# Function to start in new PowerShell terminal
function Start-InNewTerminal {
    param(
        [string]$Title,
        [string]$Command,
        [string]$WorkingDirectory = $PWD.Path,
        [string]$Color = "Blue"
    )
    
    Write-Host "Starting $Title in new terminal..." -ForegroundColor $Color
    
    # Prepare command for new terminal
    $escapedCommand = $Command -replace '"', '`"'
    $fullCommand = "Set-Location '$WorkingDirectory'; Write-Host '=== $Title ==='; $escapedCommand"
    
    # Start new PowerShell terminal
    try {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $fullCommand
        Write-Host "Terminal $Title started successfully" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "Error starting terminal $Title" -ForegroundColor Red
        return $false
    }
}

# Function to start backend in new terminal
function Start-BackendTerminal {
    param(
        [string]$ProjectRoot = $PWD.Path
    )
    
    $backendPath = Join-Path $ProjectRoot "apps\api"
    $command = "npm run dev"
    
    Write-Host "Checking backend path: $backendPath" -ForegroundColor Gray
    
    if (-not (Test-Path $backendPath)) {
        Write-Host "ERROR: apps\api directory does not exist!" -ForegroundColor Red
        return $false
    }
    
    return Start-InNewTerminal -Title "LiteCMMS Backend" -Command $command -WorkingDirectory $backendPath -Color "Blue"
}

# Function to start frontend in new terminal - ALWAYS on port 3000
function Start-FrontendTerminal {
    param(
        [string]$ProjectRoot = $PWD.Path
    )
    
    # FORCE frontend to port 3000 for end users
    $command = "pnpm dev:web --port 3000"
    
    Write-Host "Checking project root: $ProjectRoot" -ForegroundColor Gray
    Write-Host "FORCING frontend to port 3000 for consistency" -ForegroundColor Yellow
    
    if (-not (Test-Path (Join-Path $ProjectRoot "apps\web"))) {
        Write-Host "ERROR: apps\web directory does not exist!" -ForegroundColor Red
        return $false
    }
    
    return Start-InNewTerminal -Title "LiteCMMS Frontend (Port 3000)" -Command $command -WorkingDirectory $ProjectRoot -Color "Green"
}

# Function to check if process is running in terminal
function Test-ProcessInTerminal {
    param(
        [string]$ProcessName
    )
    
    try {
        $processes = Get-Process -Name $ProcessName -ErrorAction SilentlyContinue
        return $processes.Count -gt 0
    } catch {
        return $false
    }
}

# Function to wait until processes start
function Wait-ForProcesses {
    param(
        [int]$TimeoutSeconds = 30
    )
    
    Write-Host "Waiting for processes to start (timeout: ${TimeoutSeconds}s)..." -ForegroundColor Yellow
    
    $elapsed = 0
    $checkInterval = 2
    
    while ($elapsed -lt $TimeoutSeconds) {
        $nodeCount = (Get-Process -Name "node" -ErrorAction SilentlyContinue).Count
        
        if ($nodeCount -ge 2) {
            Write-Host "Detected $nodeCount Node.js processes - system probably started" -ForegroundColor Green
            return $true
        }
        
        Write-Host "  Waiting... (${elapsed}s/${TimeoutSeconds}s, Node.js processes: $nodeCount)" -ForegroundColor Gray
        Start-Sleep -Seconds $checkInterval
        $elapsed += $checkInterval
    }
    
    Write-Host "Timeout! Processes may need more time." -ForegroundColor Yellow
    return $false
}

# Export functions
Export-ModuleMember -Function Start-InNewTerminal, Start-BackendTerminal, Start-FrontendTerminal, Test-ProcessInTerminal, Wait-ForProcesses 
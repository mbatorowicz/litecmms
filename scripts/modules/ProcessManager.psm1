# LiteCMMS Process Manager Module
# Managing Node.js, npm and PowerShell processes

# Function to kill Node.js processes
function Stop-AllNodeProcesses {
    Write-Host "Stopping all Node.js processes..." -ForegroundColor Yellow
    
    $processesKilled = $false
    
    # Method 1: taskkill for node.exe
    try {
        taskkill /F /IM node.exe 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Node.exe processes stopped (taskkill)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Taskkill node.exe failed" -ForegroundColor Yellow
    }
    
    # Method 2: taskkill for nodemon
    try {
        taskkill /F /IM nodemon.exe 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Nodemon.exe processes stopped (taskkill)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Taskkill nodemon.exe failed" -ForegroundColor Yellow
    }
    
    # Method 3: Get-Process (backup)
    try {
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "Additional node processes stopped (Get-Process)" -ForegroundColor Green
            $processesKilled = $true
        }
        
        $nodemonProcesses = Get-Process -Name "nodemon" -ErrorAction SilentlyContinue
        if ($nodemonProcesses) {
            $nodemonProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "Additional nodemon processes stopped (Get-Process)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Get-Process cleanup failed" -ForegroundColor Yellow
    }
    
    # Method 4: Kill processes on ports 3000 and 3001
    try {
        $port3000 = netstat -ano | findstr :3000 | findstr LISTENING
        $port3001 = netstat -ano | findstr :3001 | findstr LISTENING
        
        if ($port3000) {
            $pid3000 = ($port3000 -split '\s+')[-1]
            taskkill /F /PID $pid3000 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Process on port 3000 stopped (PID: $pid3000)" -ForegroundColor Green
                $processesKilled = $true
            }
        }
        
        if ($port3001) {
            $pid3001 = ($port3001 -split '\s+')[-1]
            taskkill /F /PID $pid3001 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Process on port 3001 stopped (PID: $pid3001)" -ForegroundColor Green
                $processesKilled = $true
            }
        }
    } catch {
        Write-Host "Killing processes on ports failed" -ForegroundColor Yellow
    }
    
    # Method 5: Kill all PowerShell windows with npm
    try {
        $npmProcesses = Get-WmiObject Win32_Process | Where-Object { 
            $_.CommandLine -like "*npm run dev*" -or 
            $_.CommandLine -like "*npm run dev:server*" 
        }
        
        if ($npmProcesses) {
            foreach ($proc in $npmProcesses) {
                taskkill /F /PID $proc.ProcessId 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "NPM process stopped (PID: $($proc.ProcessId))" -ForegroundColor Green
                    $processesKilled = $true
                }
            }
        }
    } catch {
        Write-Host "Killing npm processes failed" -ForegroundColor Yellow
    }
    
    if (-not $processesKilled) {
        Write-Host "No Node.js processes to stop" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 3
}

# Function to clear PowerShell Jobs
function Clear-PowerShellJobs {
    Write-Host "Clearing PowerShell Jobs..." -ForegroundColor Yellow
    
    try {
        $jobs = Get-Job -ErrorAction SilentlyContinue
        if ($jobs) {
            $jobs | Stop-Job -ErrorAction SilentlyContinue
            $jobs | Remove-Job -Force -ErrorAction SilentlyContinue
            Write-Host "PowerShell Jobs cleared" -ForegroundColor Green
        } else {
            Write-Host "No Jobs to clear" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Error clearing Jobs" -ForegroundColor Red
    }
}

# Export functions
Export-ModuleMember -Function Stop-AllNodeProcesses, Clear-PowerShellJobs 
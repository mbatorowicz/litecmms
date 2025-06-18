# LiteCMMS Smart Port Manager Module
# Smart port management for 3000/3001

# Function to check if port is occupied
function Test-PortOccupied {
    param(
        [int]$Port
    )
    
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        return $connection.Count -gt 0
    } catch {
        # Fallback to netstat
        try {
            $netstat = netstat -an | findstr ":$Port.*LISTENING"
            return $netstat.Count -gt 0
        } catch {
            return $false
        }
    }
}

# Function to find PID of process on port
function Get-PortProcess {
    param(
        [int]$Port
    )
    
    try {
        # Method 1: Get-NetTCPConnection (preferred)
        $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        if ($connection) {
            return $connection.OwningProcess
        }
    } catch { }
    
    try {
        # Method 2: netstat (fallback)
        $netstatOutput = netstat -ano | findstr ":$Port.*LISTENING"
        if ($netstatOutput) {
            $pid = ($netstatOutput -split '\s+')[-1]
            return [int]$pid
        }
    } catch { }
    
    return $null
}

# Function to kill process on port
function Stop-ProcessOnPort {
    param(
        [int]$Port,
        [string]$PortName = "Port $Port"
    )
    
    Write-Host "Checking port $Port ($PortName)..." -ForegroundColor Yellow
    
    if (-not (Test-PortOccupied -Port $Port)) {
        Write-Host "  Port $Port is free" -ForegroundColor Green
        return $true
    }
    
    $pid = Get-PortProcess -Port $Port
    if (-not $pid) {
        Write-Host "  Cannot find process on port $Port" -ForegroundColor Yellow
        return $false
    }
    
    try {
        $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($process) {
            $processName = $process.ProcessName
            Write-Host "  Found process: $processName (PID: $pid)" -ForegroundColor Gray
            
            # Kill process
            taskkill /F /PID $pid 2>$null | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  Process $processName stopped" -ForegroundColor Green
                Start-Sleep -Seconds 1
                
                # Check if port is really free
                if (-not (Test-PortOccupied -Port $Port)) {
                    Write-Host "  Port $Port is now free" -ForegroundColor Green
                    return $true
                } else {
                    Write-Host "  Port $Port still occupied" -ForegroundColor Yellow
                    return $false
                }
            } else {
                Write-Host "  Failed to stop process $processName" -ForegroundColor Red
                return $false
            }
        } else {
            Write-Host "  Process PID $pid does not exist" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "  Error stopping process PID $pid" -ForegroundColor Red
        return $false
    }
}

# Function to clear system ports
function Clear-SystemPorts {
    Write-Host "=== CLEARING SYSTEM PORTS ===" -ForegroundColor Cyan
    
    $ports = @(
        @{Port=3000; Name="Frontend"},
        @{Port=3001; Name="Backend"}
    )
    
    $allCleared = $true
    
    foreach ($portInfo in $ports) {
        $result = Stop-ProcessOnPort -Port $portInfo.Port -PortName $portInfo.Name
        if (-not $result) {
            $allCleared = $false
        }
    }
    
    Write-Host ""
    if ($allCleared) {
        Write-Host "All system ports are free" -ForegroundColor Green
    } else {
        Write-Host "Some ports may still be occupied" -ForegroundColor Yellow
    }
    
    return $allCleared
}

# Function to show port status
function Show-PortStatus {
    Write-Host "=== SYSTEM PORTS STATUS ===" -ForegroundColor Cyan
    
    $ports = @(
        @{Port=3000; Name="Frontend"},
        @{Port=3001; Name="Backend"},
        @{Port=5432; Name="PostgreSQL"}
    )
    
    foreach ($portInfo in $ports) {
        $isOccupied = Test-PortOccupied -Port $portInfo.Port
        
        if ($isOccupied) {
            $pid = Get-PortProcess -Port $portInfo.Port
            $processName = "unknown"
            
            if ($pid) {
                try {
                    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                    if ($process) {
                        $processName = $process.ProcessName
                    }
                } catch { }
            }
            
            Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): OCCUPIED by $processName (PID: $pid)" -ForegroundColor Red
        } else {
            Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): FREE" -ForegroundColor Green
        }
    }
    Write-Host ""
}

# Export functions
Export-ModuleMember -Function Test-PortOccupied, Get-PortProcess, Stop-ProcessOnPort, Clear-SystemPorts, Show-PortStatus 
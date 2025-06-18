# LiteCMMS System Tester Module
# System health and status testing

# Function to test system status
function Test-SystemStatus {
    $results = @()
    
    # Test backend health
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
        $results += "Backend Health: OK - $($health.message)"
    } catch {
        $results += "Backend Health: ERROR - $($_.Exception.Message)"
    }
    
    # Test API system status
    try {
        $system = Invoke-RestMethod -Uri "http://localhost:3001/api/status" -TimeoutSec 5
        $dbStatus = $system.database.status
        $results += "System Status: OK - Database: $dbStatus"
    } catch {
        $results += "System Status: ERROR - $($_.Exception.Message)"
    }
    
    # Test frontend (ALWAYS port 3000)
    try {
        $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 4
        $results += "Frontend (3000): OK - HTTP $($frontend.StatusCode)"
    } catch {
        $results += "Frontend: ERROR - Not responding on port 3000!"
    }
    
    # Display results
    foreach ($result in $results) {
        if ($result -like "*OK*") {
            Write-Host $result -ForegroundColor Green
        } else {
            Write-Host $result -ForegroundColor Red
        }
    }
    
    return $results
}

# Function to show PowerShell Jobs
function Show-PowerShellJobs {
    try {
        $jobs = Get-Job -ErrorAction SilentlyContinue
        if ($jobs) {
            Write-Host "Active PowerShell Jobs:" -ForegroundColor Yellow
            foreach ($job in $jobs) {
                $status = $job.State
                $color = if ($status -eq "Running") { "Green" } else { "Red" }
                Write-Host "  Job $($job.Id): $($job.Name) - $status" -ForegroundColor $color
            }
        } else {
            Write-Host "No active PowerShell Jobs" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Error checking PowerShell Jobs" -ForegroundColor Red
    }
}

# Export functions
Export-ModuleMember -Function Test-SystemStatus, Show-PowerShellJobs 
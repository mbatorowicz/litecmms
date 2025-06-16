# LiteCMMS System Tester Module
# Testowanie funkcjonalności systemu

# Funkcja do testowania systemu
function Test-SystemStatus {
    Write-Host "Testowanie systemu..." -ForegroundColor Yellow
    
    $results = @()
    
    # Test backendu
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
        $results += "Backend Health: OK - $($health.message)"
    } catch {
        $results += "Backend Health: BŁĄD - $($_.Exception.Message)"
    }
    
    # Test API systemu
    try {
        $system = Invoke-RestMethod -Uri "http://localhost:3001/api/system-status" -TimeoutSec 5
        $dbStatus = $system.database.status
        $results += "System Status: OK - Database: $dbStatus"
    } catch {
        $results += "System Status: BŁĄD - $($_.Exception.Message)"
    }
    
    # Test frontendu - TYLKO PORT 3000!
    $frontendOk = $false
    
    try {
        $frontend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 4
        $results += "Frontend (3000): OK - HTTP $($frontend.StatusCode)"
        $frontendOk = $true
    } catch {
        $results += "Frontend: BŁĄD - Nie odpowiada na porcie 3000!"
    }
    
    # Wyświetl wyniki
    Write-Host ""
    Write-Host "=== WYNIKI TESTÓW ===" -ForegroundColor Cyan
    foreach ($result in $results) {
        if ($result -like "*OK*") {
            Write-Host "  $result" -ForegroundColor Green
        } else {
            Write-Host "  $result" -ForegroundColor Red
        }
    }
    
    return $frontendOk
}

# Funkcja do wyświetlania PowerShell Jobs
function Show-PowerShellJobs {
    Write-Host ""
    Write-Host "=== POWERSHELL JOBS ===" -ForegroundColor Cyan
    $jobs = Get-Job -ErrorAction SilentlyContinue
    if ($jobs) {
        $jobs | ForEach-Object {
            $color = switch ($_.State) {
                "Running" { "Green" }
                "Completed" { "Blue" }
                "Failed" { "Red" }
                default { "Yellow" }
            }
            Write-Host "  Job $($_.Id): $($_.Name) - $($_.State)" -ForegroundColor $color
        }
    } else {
        Write-Host "  Brak aktywnych Jobs" -ForegroundColor Gray
    }
}

# Export funkcji
Export-ModuleMember -Function Test-SystemStatus, Show-PowerShellJobs 
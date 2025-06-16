# LiteCMMS Process Manager Module
# Zarządzanie procesami Node.js, npm i PowerShell

# Funkcja do zabijania procesów Node.js
function Stop-AllNodeProcesses {
    Write-Host "Zatrzymywanie wszystkich procesów Node.js..." -ForegroundColor Yellow
    
    $processesKilled = $false
    
    # Metoda 1: taskkill dla node.exe
    try {
        taskkill /F /IM node.exe 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Procesy node.exe zatrzymane (taskkill)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Taskkill node.exe nie powiódł się" -ForegroundColor Yellow
    }
    
    # Metoda 2: taskkill dla nodemon
    try {
        taskkill /F /IM nodemon.exe 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Procesy nodemon.exe zatrzymane (taskkill)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Taskkill nodemon.exe nie powiódł się" -ForegroundColor Yellow
    }
    
    # Metoda 3: Get-Process (backup)
    try {
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "Dodatkowe procesy node zatrzymane (Get-Process)" -ForegroundColor Green
            $processesKilled = $true
        }
        
        $nodemonProcesses = Get-Process -Name "nodemon" -ErrorAction SilentlyContinue
        if ($nodemonProcesses) {
            $nodemonProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "Dodatkowe procesy nodemon zatrzymane (Get-Process)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Get-Process cleanup nie powiódł się" -ForegroundColor Yellow
    }
    
    # Metoda 4: Zabij procesy na portach 3000 i 3001
    try {
        $port3000 = netstat -ano | findstr :3000 | findstr LISTENING
        $port3001 = netstat -ano | findstr :3001 | findstr LISTENING
        
        if ($port3000) {
            $pid3000 = ($port3000 -split '\s+')[-1]
            taskkill /F /PID $pid3000 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Proces na porcie 3000 zatrzymany (PID: $pid3000)" -ForegroundColor Green
                $processesKilled = $true
            }
        }
        
        if ($port3001) {
            $pid3001 = ($port3001 -split '\s+')[-1]
            taskkill /F /PID $pid3001 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Proces na porcie 3001 zatrzymany (PID: $pid3001)" -ForegroundColor Green
                $processesKilled = $true
            }
        }
    } catch {
        Write-Host "Zabijanie procesów na portach nie powiodło się" -ForegroundColor Yellow
    }
    
    # Metoda 5: Zabij wszystkie okna PowerShell z npm
    try {
        $npmProcesses = Get-WmiObject Win32_Process | Where-Object { 
            $_.CommandLine -like "*npm run dev*" -or 
            $_.CommandLine -like "*npm run dev:server*" 
        }
        
        if ($npmProcesses) {
            foreach ($proc in $npmProcesses) {
                taskkill /F /PID $proc.ProcessId 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "Proces npm zatrzymany (PID: $($proc.ProcessId))" -ForegroundColor Green
                    $processesKilled = $true
                }
            }
        }
    } catch {
        Write-Host "Zabijanie procesów npm nie powiodło się" -ForegroundColor Yellow
    }
    
    if (-not $processesKilled) {
        Write-Host "Brak procesów Node.js do zatrzymania" -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 3
}

# Funkcja do czyszczenia PowerShell Jobs
function Clear-PowerShellJobs {
    Write-Host "Czyszczenie PowerShell Jobs..." -ForegroundColor Yellow
    
    try {
        $jobs = Get-Job -ErrorAction SilentlyContinue
        if ($jobs) {
            $jobs | Stop-Job -ErrorAction SilentlyContinue
            $jobs | Remove-Job -Force -ErrorAction SilentlyContinue
            Write-Host "PowerShell Jobs wyczyszczone" -ForegroundColor Green
        } else {
            Write-Host "Brak Jobs do wyczyszczenia" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Błąd podczas czyszczenia Jobs" -ForegroundColor Red
    }
}

# Export funkcji
Export-ModuleMember -Function Stop-AllNodeProcesses, Clear-PowerShellJobs 
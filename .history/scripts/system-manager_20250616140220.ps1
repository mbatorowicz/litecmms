# LiteCMMS System Manager - Niezawodny skrypt zarzadzania
# Rozwiazuje problemy z portami, procesami i uruchamianiem

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Action
)

Write-Host "=== LiteCMMS System Manager ===" -ForegroundColor Cyan
Write-Host "Akcja: $Action" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Cyan

# Funkcja do zabijania procesow Node.js
function Stop-AllNodeProcesses {
    Write-Host "Zatrzymywanie wszystkich procesow Node.js..." -ForegroundColor Yellow
    
    $processesKilled = $false
    
    # Metoda 1: taskkill dla node.exe
    try {
        taskkill /F /IM node.exe 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Procesy node.exe zatrzymane (taskkill)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Taskkill node.exe nie powiodl sie" -ForegroundColor Yellow
    }
    
    # Metoda 2: taskkill dla nodemon
    try {
        taskkill /F /IM nodemon.exe 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Procesy nodemon.exe zatrzymane (taskkill)" -ForegroundColor Green
            $processesKilled = $true
        }
    } catch {
        Write-Host "Taskkill nodemon.exe nie powiodl sie" -ForegroundColor Yellow
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
        Write-Host "Get-Process cleanup nie powiodl sie" -ForegroundColor Yellow
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
        Write-Host "Zabijanie procesow na portach nie powiodlo sie" -ForegroundColor Yellow
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
        Write-Host "Zabijanie procesow npm nie powiodlo sie" -ForegroundColor Yellow
    }
    
    if (-not $processesKilled) {
        Write-Host "Brak procesow Node.js do zatrzymania" -ForegroundColor Gray
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
        Write-Host "Blad podczas czyszczenia Jobs" -ForegroundColor Red
    }
}

# Funkcja do sprawdzania portow
function Test-SystemPorts {
    Write-Host "Sprawdzanie portow..." -ForegroundColor Yellow
    
    $ports = @(
        @{Port=3000; Name="Frontend"},
        @{Port=3001; Name="Backend"},
        @{Port=5432; Name="PostgreSQL"}
    )
    
    foreach ($portInfo in $ports) {
        try {
            $connection = Test-NetConnection -ComputerName "localhost" -Port $portInfo.Port -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($connection) {
                Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): POLACZONY" -ForegroundColor Green
            } else {
                Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): NIEDOSTEPNY" -ForegroundColor Red
            }
        } catch {
            Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): BLAD TESTU" -ForegroundColor Yellow
        }
    }
}

# Funkcja do uruchamiania backendu
function Start-Backend {
    Write-Host "Uruchamianie backendu..." -ForegroundColor Yellow
    
    # Sprawdz czy port 3001 jest wolny (z retry)
    for ($i = 1; $i -le 3; $i++) {
        $backendPort = Test-NetConnection -ComputerName "localhost" -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($backendPort) {
            Write-Host "Proba $i/3: Port 3001 jest zajety, czekam..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        } else {
            Write-Host "Port 3001 jest wolny, uruchamiam backend..." -ForegroundColor Green
            break
        }
    }
    
    # Jesli nadal zajety po 3 probach
    if ($backendPort) {
        Write-Host "BLAD: Port 3001 nadal zajety po 3 probach!" -ForegroundColor Red
        return $false
    }
    
    # Uruchom backend w osobnym oknie terminala
    try {
        $backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev:server" -WindowStyle Normal -PassThru
        
        Write-Host "Backend uruchomiony w osobnym oknie (PID: $($backendProcess.Id))" -ForegroundColor Green
        
        # Czekaj na uruchomienie
        Write-Host "Czekam 10 sekund na uruchomienie backendu..." -ForegroundColor Gray
        Start-Sleep -Seconds 10
        
        # Test endpointu
        for ($i = 1; $i -le 5; $i++) {
            try {
                $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
                Write-Host "Backend dziala! Wiadomosc: $($response.message)" -ForegroundColor Green
                return $true
            } catch {
                Write-Host "Proba $i/5: Backend jeszcze nie odpowiada..." -ForegroundColor Yellow
                Start-Sleep -Seconds 3
            }
        }
        
        Write-Host "BLAD: Backend nie odpowiada po 5 probach" -ForegroundColor Red
        return $false
        
    } catch {
        Write-Host "BLAD uruchamiania backendu: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funkcja do uruchamiania frontendu - NAPRAWIONA
function Start-Frontend {
    Write-Host "Uruchamianie frontendu..." -ForegroundColor Yellow
    
    # Sprawdz czy port 3000 jest wolny
    $frontendPort = Test-NetConnection -ComputerName "localhost" -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($frontendPort) {
        Write-Host "OSTRZEZENIE: Port 3000 zajety, Next.js wybierze inny port" -ForegroundColor Yellow
    }
    
    try {
        # Uruchom frontend w osobnym oknie terminala
        $frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal -PassThru
        
        Write-Host "Frontend uruchomiony w osobnym oknie (PID: $($frontendProcess.Id))" -ForegroundColor Green
        
        # Czekaj na uruchomienie - wydłużony czas
        Write-Host "Czekam 25 sekund na uruchomienie frontendu..." -ForegroundColor Gray
        Start-Sleep -Seconds 25
        
        # NAPRAWIONE: Sprawdz wszystkie możliwe porty Next.js
        $possiblePorts = @(3000, 3002, 3003, 3004, 3005)
        $frontendFound = $false
        $frontendUrl = ""
        
        foreach ($port in $possiblePorts) {
            try {
                Write-Host "Sprawdzanie portu $port..." -ForegroundColor Gray
                $response = Invoke-WebRequest -Uri "http://localhost:$port" -TimeoutSec 8
                if ($response.StatusCode -eq 200) {
                    Write-Host "✅ Frontend dziala na porcie $port!" -ForegroundColor Green
                    $frontendUrl = "http://localhost:$port"
                    $frontendFound = $true
                    break
                }
            } catch {
                # Port nie odpowiada - próbuj następny
                continue
            }
        }
        
        if ($frontendFound) {
            Write-Host "🌐 Frontend dostępny na: $frontendUrl" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ BŁĄD: Frontend nie odpowiada na żadnym porcie (3000, 3002-3005)" -ForegroundColor Red
            Write-Host "💡 Sprawdź okno terminala z 'npm run dev'" -ForegroundColor Yellow
            return $false
        }
        
    } catch {
        Write-Host "BLAD uruchamiania frontendu: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funkcja do testowania systemu
function Test-SystemStatus {
    Write-Host "Testowanie systemu..." -ForegroundColor Yellow
    
    $results = @()
    
    # Test backendu
    try {
        $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
        $results += "Backend Health: OK - $($health.message)"
    } catch {
        $results += "Backend Health: BLAD - $($_.Exception.Message)"
    }
    
    # Test API systemu
    try {
        $system = Invoke-RestMethod -Uri "http://localhost:3001/api/system-status" -TimeoutSec 5
        $dbStatus = $system.database.status
        $results += "System Status: OK - Database: $dbStatus"
    } catch {
        $results += "System Status: BLAD - $($_.Exception.Message)"
    }
    
    # Test frontendu - NAPRAWIONY
    $frontendOk = $false
    $frontendPorts = @(3000, 3002, 3003, 3004, 3005)
    $frontendFound = $false
    
    foreach ($port in $frontendPorts) {
        try {
            $frontend = Invoke-WebRequest -Uri "http://localhost:$port" -TimeoutSec 4
            $results += "Frontend ($port): OK - HTTP $($frontend.StatusCode)"
            $frontendOk = $true
            $frontendFound = $true
            break
        } catch {
            # Kontynuuj sprawdzanie następnego portu
            continue
        }
    }
    
    if (-not $frontendFound) {
        $results += "Frontend: BŁĄD - Nie odpowiada na portach 3000, 3002-3005"
    }
    
    # Wyswietl wyniki
    Write-Host ""
    Write-Host "=== WYNIKI TESTOW ===" -ForegroundColor Cyan
    foreach ($result in $results) {
        if ($result -like "*OK*") {
            Write-Host "  $result" -ForegroundColor Green
        } else {
            Write-Host "  $result" -ForegroundColor Red
        }
    }
    
    return $frontendOk
}

# GLOWNA LOGIKA
switch ($Action) {
    "stop" {
        Write-Host ""
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Test-SystemPorts
        Write-Host "System zatrzymany" -ForegroundColor Green
    }
    
    "start" {
        Write-Host ""
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Test-SystemPorts
        
        Write-Host ""
        Write-Host "=== URUCHAMIANIE SYSTEMU ===" -ForegroundColor Cyan
        
        $backendOk = Start-Backend
        if ($backendOk) {
            $frontendOk = Start-Frontend
            if ($frontendOk) {
                Write-Host ""
                Test-SystemStatus
                Write-Host ""
                Write-Host "=== SYSTEM URUCHOMIONY ===" -ForegroundColor Green
                Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
                Write-Host "Backend:  http://localhost:3001" -ForegroundColor White
                Write-Host "Health:   http://localhost:3001/health" -ForegroundColor White
            } else {
                Write-Host "BLAD: Frontend nie uruchomil sie poprawnie" -ForegroundColor Red
            }
        } else {
            Write-Host "BLAD: Backend nie uruchomil sie poprawnie" -ForegroundColor Red
        }
    }
    
    "restart" {
        Write-Host ""
        Write-Host "=== RESTART SYSTEMU ===" -ForegroundColor Yellow
        
        # Stop
        Stop-AllNodeProcesses
        Clear-PowerShellJobs
        Start-Sleep -Seconds 2
        
        # Start
        Test-SystemPorts
        $backendOk = Start-Backend
        if ($backendOk) {
            $frontendOk = Start-Frontend
            if ($frontendOk) {
                Test-SystemStatus
                Write-Host "=== RESTART ZAKONCZONY ===" -ForegroundColor Green
            }
        }
    }
    
    "status" {
        Write-Host ""
        Test-SystemPorts
        Write-Host ""
        Test-SystemStatus
        
        # Pokaz Jobs
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
}

Write-Host ""
Write-Host "=== KONIEC ===" -ForegroundColor Cyan 
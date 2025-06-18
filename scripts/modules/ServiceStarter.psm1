# LiteCMMS Service Starter Module - MONOREPO VERSION
# Uruchamianie serwisów Backend API i Frontend Web z pnpm

# Funkcja do uruchamiania backendu API
function Start-Backend {
    Write-Host "Uruchamianie Backend API (apps/api)..." -ForegroundColor Yellow
    
    # Sprawdź czy pnpm jest dostępny
    try {
        $pnpmVersion = pnpm --version
        Write-Host "Używam pnpm $pnpmVersion" -ForegroundColor Cyan
    } catch {
        Write-Host "BŁĄD: pnpm nie jest zainstalowany!" -ForegroundColor Red
        Write-Host "Zainstaluj: npm install -g pnpm" -ForegroundColor Yellow
        return $false
    }
    
    # Sprawdź czy port 3001 jest wolny (z retry)
    for ($i = 1; $i -le 3; $i++) {
        $backendPort = Test-NetConnection -ComputerName "localhost" -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($backendPort) {
            Write-Host "Próba $i/3: Port 3001 jest zajęty, czekam..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        } else {
            Write-Host "Port 3001 jest wolny, uruchamiam backend API..." -ForegroundColor Green
            break
        }
    }
    
    # Jeśli nadal zajęty po 3 próbach
    if ($backendPort) {
        Write-Host "BŁĄD: Port 3001 nadal zajęty po 3 próbach!" -ForegroundColor Red
        return $false
    }
    
    # Uruchom backend API w osobnym oknie terminala
    try {
        $backendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm --filter api dev" -WindowStyle Normal -PassThru
        
        Write-Host "Backend API uruchomiony w osobnym oknie (PID: $($backendProcess.Id))" -ForegroundColor Green
        
        # Czekaj na uruchomienie
        Write-Host "Czekam 10 sekund na uruchomienie backend API..." -ForegroundColor Gray
        Start-Sleep -Seconds 10
        
        # Test endpointu
        for ($i = 1; $i -le 5; $i++) {
            try {
                $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -TimeoutSec 5
                Write-Host "Backend API działa! Wiadomość: $($response.message)" -ForegroundColor Green
                return $true
            } catch {
                Write-Host "Próba $i/5: Backend API jeszcze nie odpowiada..." -ForegroundColor Yellow
                Start-Sleep -Seconds 3
            }
        }
        
        Write-Host "BŁĄD: Backend API nie odpowiada po 5 próbach" -ForegroundColor Red
        return $false
        
    } catch {
        Write-Host "BŁĄD uruchamiania backend API: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funkcja do uruchamiania frontendu Web
function Start-Frontend {
    Write-Host "Uruchamianie Frontend Web (apps/web)..." -ForegroundColor Yellow
    
    # Sprawdź czy port 3000 jest wolny
    $frontendPort = Test-NetConnection -ComputerName "localhost" -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($frontendPort) {
        Write-Host "OSTRZEŻENIE: Port 3000 zajęty, Next.js może wybrać inny port" -ForegroundColor Yellow
    }
    
    try {
        # FRONTEND WEB ZAWSZE PORT 3000 - używamy pnpm
        $pnpmCommand = "pnpm --filter web dev"
        $expectedPort = 3000
        
        Write-Host "Używam komendy: $pnpmCommand (port $expectedPort)" -ForegroundColor Cyan
        Write-Host "UWAGA: Frontend Web MUSI być na porcie 3000!" -ForegroundColor Yellow
        
        # Uruchom frontend w osobnym oknie terminala
        $frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $pnpmCommand" -WindowStyle Normal -PassThru
        
        Write-Host "Frontend Web uruchomiony w osobnym oknie (PID: $($frontendProcess.Id))" -ForegroundColor Green
        
        # Czekaj na uruchomienie - wydłużony czas dla monorepo
        Write-Host "Czekam 30 sekund na uruchomienie frontend Web..." -ForegroundColor Gray
        Start-Sleep -Seconds 30
        
        # SPRAWDZENIE - TYLKO PORT 3000!
        Write-Host "Sprawdzam frontend Web na porcie 3000..." -ForegroundColor Gray
        $frontendFound = $false
        $frontendUrl = ""
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Frontend Web działa na porcie 3000!" -ForegroundColor Green
                $frontendUrl = "http://localhost:3000"
                $frontendFound = $true
            }
        } catch {
            Write-Host "❌ Frontend Web nie odpowiada na porcie 3000!" -ForegroundColor Red
            Write-Host "💡 Sprawdź okno terminala z frontend Web" -ForegroundColor Yellow
        }
        
        if ($frontendFound) {
            Write-Host "🌐 Frontend Web dostępny na: $frontendUrl" -ForegroundColor Cyan
            Write-Host "🏗️ Architektura: Monorepo (apps/web + apps/api)" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ BŁĄD: Frontend Web nie uruchomił się na porcie 3000!" -ForegroundColor Red
            Write-Host "Sprawdź okno terminala z 'pnpm --filter web dev'" -ForegroundColor Yellow
            Write-Host "⚠️  Frontend Web MUSI być na porcie 3000!" -ForegroundColor Yellow
            return $false
        }
        
    } catch {
        Write-Host "BŁĄD uruchamiania frontend Web: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Export funkcji
Export-ModuleMember -Function Start-Backend, Start-Frontend 
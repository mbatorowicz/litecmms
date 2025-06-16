# LiteCMMS Service Starter Module
# Uruchamianie serwisów Backend i Frontend

# Funkcja do uruchamiania backendu
function Start-Backend {
    Write-Host "Uruchamianie backendu..." -ForegroundColor Yellow
    
    # Sprawdź czy port 3001 jest wolny (z retry)
    for ($i = 1; $i -le 3; $i++) {
        $backendPort = Test-NetConnection -ComputerName "localhost" -Port 3001 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($backendPort) {
            Write-Host "Próba $i/3: Port 3001 jest zajęty, czekam..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        } else {
            Write-Host "Port 3001 jest wolny, uruchamiam backend..." -ForegroundColor Green
            break
        }
    }
    
    # Jeśli nadal zajęty po 3 próbach
    if ($backendPort) {
        Write-Host "BŁĄD: Port 3001 nadal zajęty po 3 próbach!" -ForegroundColor Red
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
                Write-Host "Backend działa! Wiadomość: $($response.message)" -ForegroundColor Green
                return $true
            } catch {
                Write-Host "Próba $i/5: Backend jeszcze nie odpowiada..." -ForegroundColor Yellow
                Start-Sleep -Seconds 3
            }
        }
        
        Write-Host "BŁĄD: Backend nie odpowiada po 5 próbach" -ForegroundColor Red
        return $false
        
    } catch {
        Write-Host "BŁĄD uruchamiania backendu: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Funkcja do uruchamiania frontendu - NAPRAWIONA
function Start-Frontend {
    Write-Host "Uruchamianie frontendu..." -ForegroundColor Yellow
    
    # Sprawdź czy port 3000 jest wolny
    $frontendPort = Test-NetConnection -ComputerName "localhost" -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($frontendPort) {
        Write-Host "OSTRZEŻENIE: Port 3000 zajęty, Next.js wybierze inny port" -ForegroundColor Yellow
    }
    
    try {
        # FRONTEND ZAWSZE PORT 3000 - żadnych fallbacków!
        $npmCommand = "npm run dev"
        $expectedPort = 3000
        
        Write-Host "Używam komendy: $npmCommand (port $expectedPort)" -ForegroundColor Cyan
        Write-Host "UWAGA: Frontend MUSI być na porcie 3000!" -ForegroundColor Yellow
        
        # Uruchom frontend w osobnym oknie terminala
        $frontendProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $npmCommand" -WindowStyle Normal -PassThru
        
        Write-Host "Frontend uruchomiony w osobnym oknie (PID: $($frontendProcess.Id))" -ForegroundColor Green
        
        # Czekaj na uruchomienie - wydłużony czas
        Write-Host "Czekam 25 sekund na uruchomienie frontendu..." -ForegroundColor Gray
        Start-Sleep -Seconds 25
        
        # SPRAWDZENIE - TYLKO PORT 3000!
        Write-Host "Sprawdzam frontend na porcie 3000..." -ForegroundColor Gray
        $frontendFound = $false
        $frontendUrl = ""
        
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
            if ($response.StatusCode -eq 200) {
                Write-Host "✅ Frontend działa na porcie 3000!" -ForegroundColor Green
                $frontendUrl = "http://localhost:3000"
                $frontendFound = $true
            }
        } catch {
            Write-Host "❌ Frontend nie odpowiada na porcie 3000!" -ForegroundColor Red
            Write-Host "💡 Sprawdź okno terminala z frontend" -ForegroundColor Yellow
        }
        
        if ($frontendFound) {
            Write-Host "🌐 Frontend dostępny na: $frontendUrl" -ForegroundColor Cyan
            return $true
        } else {
            Write-Host "❌ BŁĄD: Frontend nie uruchomił się na porcie 3000!" -ForegroundColor Red
            Write-Host "Sprawdź okno terminala z 'npm run dev'" -ForegroundColor Yellow
            Write-Host "⚠️  Frontend MUSI być na porcie 3000!" -ForegroundColor Yellow
            return $false
        }
        
    } catch {
        Write-Host "BŁĄD uruchamiania frontendu: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Export funkcji
Export-ModuleMember -Function Start-Backend, Start-Frontend 
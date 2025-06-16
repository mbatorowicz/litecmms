# LiteCMMS Port Tester Module
# Testowanie dostępności portów systemowych

# Funkcja do sprawdzania portów
function Test-SystemPorts {
    Write-Host "Sprawdzanie portów..." -ForegroundColor Yellow
    
    $ports = @(
        @{Port=3000; Name="Frontend"},
        @{Port=3001; Name="Backend"},
        @{Port=5432; Name="PostgreSQL"}
    )
    
    foreach ($portInfo in $ports) {
        try {
            $connection = Test-NetConnection -ComputerName "localhost" -Port $portInfo.Port -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($connection) {
                Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): POŁĄCZONY" -ForegroundColor Green
            } else {
                Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): NIEDOSTĘPNY" -ForegroundColor Red
            }
        } catch {
            Write-Host "  Port $($portInfo.Port) ($($portInfo.Name)): BŁĄD TESTU" -ForegroundColor Yellow
        }
    }
}

# Export funkcji
Export-ModuleMember -Function Test-SystemPorts 
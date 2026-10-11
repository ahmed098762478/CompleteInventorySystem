$ErrorActionPreference = "Stop"

$backendPath = Join-Path $PSScriptRoot "project1"
$frontendPath = Join-Path $PSScriptRoot "front"

# Vérifications minimales
if (-not (Test-Path -LiteralPath (Join-Path $backendPath "mvnw.cmd") -PathType Leaf)) {
    Write-Error "Backend Spring introuvable: $backendPath"
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $frontendPath "package.json") -PathType Leaf)) {
    Write-Error "Frontend React introuvable: $frontendPath"
    exit 1
}

# Verifier les outils avant d'ouvrir les terminaux.
$powershellExecutable = (Get-Command powershell.exe -CommandType Application).Source
Get-Command java.exe -CommandType Application | Out-Null
Get-Command npm.cmd -CommandType Application | Out-Null

# Les commandes encodees evitent de reinterpreter les chemins avec espaces.
$backendCommand = {
    & ".\mvnw.cmd" "spring-boot:run" "-Dspring-boot.run.profiles=dev"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Le backend s'est arrete avec le code $LASTEXITCODE." -ForegroundColor Red
    }
}
$frontendCommand = {
    & npm.cmd start
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Le frontend s'est arrete avec le code $LASTEXITCODE." -ForegroundColor Red
    }
}
$encodedBackend = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($backendCommand.ToString()))
$encodedFrontend = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($frontendCommand.ToString()))

Write-Host "Demarrage du backend Spring Boot (profil dev / H2)..."
Start-Process -FilePath $powershellExecutable -WorkingDirectory $backendPath -WindowStyle Normal -ArgumentList @(
    "-NoProfile", "-NoExit", "-EncodedCommand", $encodedBackend
)

Write-Host "Demarrage du frontend React..."
Start-Process -FilePath $powershellExecutable -WorkingDirectory $frontendPath -WindowStyle Normal -ArgumentList @(
    "-NoProfile", "-NoExit", "-EncodedCommand", $encodedFrontend
)

Write-Host ""
Write-Host "Les journaux de demarrage sont affiches dans les deux terminaux."
Write-Host "Backend:  http://localhost:8080"
Write-Host "Frontend: http://localhost:3000"
Write-Host "H2 Console: http://localhost:8080/h2-console"

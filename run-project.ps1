$backendPath = "C:\Users\lahme\Desktop\EMSI-PROJECTS\SimpleCrud\project1"
$frontendPath = "C:\Users\lahme\Desktop\EMSI-PROJECTS\SimpleCrud\front"

# Vérifications minimales
if (-not (Test-Path "$backendPath\mvnw.cmd")) {
    Write-Error "Backend Spring introuvable: $backendPath"
    exit 1
}

if (-not (Test-Path "$frontendPath\package.json")) {
    Write-Error "Frontend React introuvable: $frontendPath"
    exit 1
}

Write-Host "Demarrage du backend Spring Boot..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; .\mvnw.cmd spring-boot:run"

Start-Sleep -Seconds 5

Write-Host "Demarrage du frontend React..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start"

Write-Host ""
Write-Host "Backend:  http://localhost:8080"
Write-Host "Frontend: http://localhost:3000"
Write-Host "H2 Console: http://localhost:8080/h2-console"
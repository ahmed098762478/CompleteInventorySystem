$root = "C:\Users\lahme\Desktop\EMSI-PROJECTS\SimpleCrud"
$backend = Join-Path $root "project1"
$frontend = Join-Path $root "front"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backend'; .\mvnw.cmd spring-boot:run"
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontend'; npm start"

Write-Host "Backend  : http://localhost:8080"
Write-Host "Frontend : http://localhost:3000"
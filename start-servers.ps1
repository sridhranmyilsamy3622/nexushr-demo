# NexusHR Enterprise Portal Launcher PowerShell Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Starting NexusHR Full-Stack Application" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$env:Path = "C:\Program Files\nodejs;" + $env:Path

$root = $PSScriptRoot

Write-Host "[1/2] Starting NexusHR Backend API Server on Port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\BACKEND'; `$env:Path = 'C:\Program Files\nodejs;' + `$env:Path; node server.js"

Start-Sleep -Seconds 2

Write-Host "[2/2] Starting NexusHR Frontend Vite Server on Port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\FRONTEND'; `$env:Path = 'C:\Program Files\nodejs;' + `$env:Path; npm run dev"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "NexusHR is launching!" -ForegroundColor Green
Write-Host "Frontend Portal:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend API:      http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

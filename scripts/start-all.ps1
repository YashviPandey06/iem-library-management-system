# IEM Library Management System - PowerShell Launcher
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " Launching Complete IEM Library Management System" -ForegroundColor Cyan
Write-Host " Institution: Institute of Engineering & Management, Kolkata" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Start Backend
Write-Host "`n[1/3] Starting Ktor Backend on http://localhost:8080..." -ForegroundColor Yellow
$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$root\scripts\start-backend.bat`"" -PassThru

Write-Host "Waiting 5 seconds for backend to start..."
Start-Sleep -Seconds 5

# 2. Start Frontend
Write-Host "`n[2/3] Starting Vite Web Server on http://localhost:5173..." -ForegroundColor Yellow
$webProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c `"$root\scripts\start-frontend.bat`"" -PassThru

Write-Host "Waiting 3 seconds..."
Start-Sleep -Seconds 3

# 3. Open Browser
Write-Host "`n[3/3] Opening Browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`nSystem is running!" -ForegroundColor Green
Write-Host "- Web Application: http://localhost:5173"
Write-Host "- Backend API:     http://localhost:8080/api/health"
Write-Host "- Console Client:  Run scripts\start-console.bat"

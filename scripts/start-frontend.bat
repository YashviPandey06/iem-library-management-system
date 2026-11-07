@echo off
setlocal
echo ====================================================================
echo Starting IEM Library Management System - Frontend (React + Vite)
echo Institution: Institute of Engineering & Management, Kolkata
echo ====================================================================

cd /d "%~dp0\..\frontend"

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not detected in your PATH.
    echo Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [INFO] First-time setup: installing dependencies...
    call npm install
)

npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend server terminated unexpectedly.
    pause
)
endlocal

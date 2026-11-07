@echo off
setlocal
echo ====================================================================
echo Launching Complete IEM Library Management System
echo Institution: Institute of Engineering & Management, Kolkata
echo ====================================================================

echo 1. Launching Kotlin Ktor Backend on http://localhost:8080...
start "IEM LMS Backend" cmd /c "%~dp0start-backend.bat"

echo Waiting 5 seconds for backend initialization...
timeout /t 5 /nobreak >nul

echo 2. Launching React Web Application on http://localhost:5173...
start "IEM LMS Frontend" cmd /c "%~dp0start-frontend.bat"

echo Waiting 3 seconds for Vite server...
timeout /t 3 /nobreak >nul

echo 3. Opening Browser Interface...
start http://localhost:5173

echo ====================================================================
echo System is running!
echo - Web Application: http://localhost:5173
echo - Backend API:     http://localhost:8080/api/health
echo - Console Client:  Run scripts\start-console.bat
echo ====================================================================
pause
endlocal

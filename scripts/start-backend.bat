@echo off
setlocal
echo ====================================================================
echo Starting IEM Library Management System - Kotlin Ktor Backend
echo Institution: Institute of Engineering & Management, Kolkata
echo ====================================================================

cd /d "%~dp0\.."

where java >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not detected in your PATH.
    echo Please install JDK 17 or higher and configure JAVA_HOME.
    pause
    exit /b 1
)

if exist "gradlew.bat" (
    call gradlew.bat :backend:run
) else (
    call gradle :backend:run
)

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend failed to start.
    pause
)
endlocal

@echo off
setlocal
echo ====================================================================
echo Starting IEM Library Management System - Kotlin Console Client
echo Institution: Institute of Engineering & Management, Kolkata
echo ====================================================================

cd /d "%~dp0\.."

if exist "gradlew.bat" (
    call gradlew.bat :console:run -q --console=plain
) else (
    call gradle :console:run -q --console=plain
)

pause
endlocal

@echo off
echo ========================================
echo    KHADAMAT PLATFORM - DEMARRAGE
echo ========================================
echo.

echo [1/3] Installation des dependances...
npm install
if %errorlevel% neq 0 (
    echo ERREUR: Impossible d'installer les dependances
    pause
    exit /b 1
)

echo.
echo [2/3] Demarrage du serveur de developpement...
echo Le site sera accessible sur: http://localhost:5173
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

npm run frontend

pause 
@echo off
echo =======================================================
echo     AI-Driven Adaptive Learning Framework (ALF)
echo                Zero-Setup Launcher
echo =======================================================
echo.

echo [1/3] Checking dependencies...
call npm install --silent

echo [2/3] Starting backend server...
start cmd /k "node src/app.js"

echo [3/3] Opening UI in your browser...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo All set! You can view the project in your browser.
echo You can safely minimize this window.

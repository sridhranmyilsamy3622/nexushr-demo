@echo off
title NexusHR Enterprise Portal Launcher
echo ========================================================
echo       Starting NexusHR Full-Stack Application
echo ========================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Starting NexusHR Backend API Server on Port 5000...
start "NexusHR Backend API (Port 5000)" cmd /k "cd /d %~dp0BACKEND && node server.js"

echo [2/2] Starting NexusHR Frontend Vite Server on Port 5173...
start "NexusHR Frontend (Port 5173)" cmd /k "cd /d %~dp0FRONTEND && npm run dev"

echo.
echo ========================================================
echo NexusHR is launching!
echo Public Website & Portal: http://localhost:5173
echo Backend API Endpoint:   http://localhost:5000/api/health
echo ========================================================
echo.
timeout /t 5 >nul
start http://localhost:5173

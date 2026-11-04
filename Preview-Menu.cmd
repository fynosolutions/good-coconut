@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Preview.ps1" -Page "/menu/"
if errorlevel 1 pause

@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Start-Preview.ps1" -Page "/#gallery" -Port 4191
if errorlevel 1 pause

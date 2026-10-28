@echo off
rem Sends your latest changes to GitHub so the live site updates.
rem RemoteSigned (this window only) lets scripts you created on this computer run,
rem but still blocks unsigned scripts downloaded from the internet.
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0publish-update.ps1"
echo.
pause

@echo off
rem One-time setup: uploads this folder to a new, empty GitHub repository.
rem RemoteSigned (this window only) lets scripts you created on this computer run,
rem but still blocks unsigned scripts downloaded from the internet.
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0setup-github.ps1"
echo.
pause

@echo off
chcp 65001 >nul
set "URL=https://workspace-beta-sand-54.vercel.app"

REM Prefer Electron desktop shell if this folder already has dependencies
if exist "%~dp0node_modules\electron\cli.js" (
  cd /d "%~dp0"
  call npm start
  exit /b %ERRORLEVEL%
)

REM Otherwise open the live site in the default browser (no install needed)
start "" "%URL%"
exit /b 0

@echo off
rem Starts a small local web server for this site and opens it in your browser.
rem Close this window to stop the server.
cd /d "%~dp0"
set PORT=8000

rem 1) Python, if a real one is installed. New Windows PCs come with a fake "python" that only
rem    opens the Microsoft Store, so each one is test-run before it is used.
py -3 -c "import sys" >nul 2>nul
if not errorlevel 1 (
  call :open
  py -3 -m http.server %PORT%
  goto :end
)
python -c "import sys" >nul 2>nul
if not errorlevel 1 (
  call :open
  python -m http.server %PORT%
  goto :end
)

rem 2) No Python: use the small server in preview.ps1, which runs on Windows PowerShell (nothing to install).
echo No Python found - using the server built into Windows instead.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0preview.ps1" -Port %PORT%

:end
echo.
echo The preview server has stopped. If you see an error above, send a screenshot of this window to Claude.
pause
goto :eof

:open
rem open the browser two seconds from now, once the server is up
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:%PORT%/'"
goto :eof

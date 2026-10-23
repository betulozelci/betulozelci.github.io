@echo off
rem Starts a small local web server for this site and opens it in your browser.
rem Close this window to stop the server.
cd /d "%~dp0"
set PORT=8000
where py >nul 2>nul && (start "" http://localhost:%PORT%/ & py -3 -m http.server %PORT% & goto :eof)
where python >nul 2>nul && (start "" http://localhost:%PORT%/ & python -m http.server %PORT% & goto :eof)
where npx >nul 2>nul && (start "" http://localhost:%PORT%/ & npx --yes http-server -p %PORT% -c-1 . & goto :eof)
echo.
echo Neither Python nor Node.js was found. Install Python from https://www.python.org/downloads/
echo (tick "Add python.exe to PATH" in the installer), then run this file again.
echo.
pause

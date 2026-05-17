@echo off
cd /d "%~dp0server"
echo Installing dependencies...
call npm install
if errorlevel 1 exit /b 1
echo Setting up database...
call npx prisma generate
call npx prisma db push
echo.
echo Starting Moodlink at http://localhost:5000
echo Open that URL in your browser (do not open HTML files directly).
echo.
call npm run dev

@echo off
cd /d "%~dp0"
echo ===== AdiaraAcademy : installation et lancement =====
where node >nul 2>nul
if errorlevel 1 goto pasnode
if not exist "backend\.env" goto pasenv
echo [1/5] Installation du backend...
cd backend
call npm install
if errorlevel 1 goto erreur
echo [2/5] Generation du client Prisma...
call npx prisma generate
if errorlevel 1 goto erreur
echo [3/5] Application des migrations sur la base...
call npx prisma migrate deploy
if errorlevel 1 goto erreur
echo [4/5] Insertion des donnees initiales...
call npm run db:seed
if errorlevel 1 goto erreur
echo      Ajout des cours et quiz du dossier contenu...
call npm run db:contenu
if errorlevel 1 goto erreur
cd ..\frontend
echo [5/5] Installation du frontend...
call npm install
if errorlevel 1 goto erreur
cd ..
start "AdiaraAcademy API" cmd /k "cd /d %~dp0backend && npm run dev"
start "AdiaraAcademy Site" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 6 >nul
start http://localhost:5173
goto fin
:pasnode
echo Node.js n'est pas installe. Installe-le depuis nodejs.org puis relance ce script.
pause
goto fin
:pasenv
echo Le fichier backend\.env est introuvable. Cree-le a partir de .env.example puis relance.
pause
goto fin
:erreur
echo.
echo Une etape a echoue. Lis le message ci-dessus.
pause
:fin

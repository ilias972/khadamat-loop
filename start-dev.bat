@echo off
REM Lancer le frontend (client) en mode développement
start cmd /k "cd client && npm install && npm run dev"

REM Lancer le backend (server) en mode watch
start cmd /k "npm install && npx tsx watch server/index.ts"

REM Afficher un message

echo Les serveurs frontend et backend sont en cours d'exécution dans deux fenêtres séparées.
pause 
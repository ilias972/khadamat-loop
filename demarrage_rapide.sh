#!/bin/bash

echo "========================================"
echo "   KHADAMAT PLATFORM - DEMARRAGE"
echo "========================================"
echo

echo "[1/3] Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "ERREUR: Impossible d'installer les dépendances"
    exit 1
fi

echo
echo "[2/3] Démarrage du serveur de développement..."
echo "Le site sera accessible sur: http://localhost:5173"
echo
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo

npm run frontend 
# Déploiement

Ce document couvre les trois modes de déploiement supportés par le build monolithique : PaaS (Render/Railway/Fly…), Docker/VPS et hébergement statique du frontend. Toutes les commandes supposent que le dépôt a été construit via `npm run build` et que Node.js **≥ 18** est utilisé.

## 1. Plateformes PaaS

1. **Provisionner les ressources**
   - Un service Node.js (runtime Node 18 ou supérieur) configuré pour exécuter `npm run start:prod`.
   - Une base Postgres managée (12+ recommandé). Récupérer l’URL de connexion.
2. **Variables d’environnement**
   - Copier `backend/.env.production.example` vers une configuration PaaS et la compléter (URL Postgres, Redis éventuel, secrets Stripe, SMTP…).
   - Les variables spécifiques au frontend (`VITE_API_BASE_URL`, `FRONTEND_URL`, etc.) doivent pointer vers l’URL publique du service API.
3. **Build & start**
   - Commande de build : `npm run build` (exécutée lors de la phase build de la plateforme).
   - Commande de démarrage :
     ```bash
     npm run start:prod
     ```
   - Le serveur Express sert automatiquement le dossier `dist/public` généré par Vite.

## 2. Docker / VPS

1. **Préparer les fichiers d’environnement**
   - Copier `backend/.env.online.staging.example` vers `backend/.env.online.staging` et le compléter (Postgres `DATABASE_URL`, Redis `REDIS_URL`, secrets Stripe, `OPS_BACKEND_URL`…).
   - Copier `backend/.env.tokens.staging.example` vers `backend/.env.tokens.staging` pour stocker les tokens Stripe/webhooks et les bearer tokens nécessaires aux scripts `online:*`.
2. **Lancer la stack**
   - Depuis la racine du dépôt :
     ```bash
     docker compose -f docker-compose.staging.yml up -d --build
     ```
   - Les services provisionnés sont :
     - `db` (Postgres 16)
     - `redis`
     - `clamav`
     - `api` (serveur Node/Express qui expose `http://localhost:5000`)
     - `web` (hébergement statique sur `http://localhost:4173`)
3. **Post-déploiement**
   - Une fois les conteneurs prêts, exécuter :
     ```bash
     npm --prefix backend run staging:postdeploy
     ```
   - Le script vérifie la santé (`ops:wait`, `ops:verify`) et lance la batterie de smoke tests en ligne.

## 3. Frontend statique (Vercel / Netlify)

1. Exécuter `npm run build` localement ou via le pipeline CI.
2. Déployer le dossier `dist/public` (ou le workspace `client/`) sur la plateforme choisie.
3. Définir la variable d’environnement `VITE_API_BASE_URL` vers l’URL publique de l’API (par exemple `https://api.example.com`).
4. Vérifier que les en-têtes CORS côté API autorisent l’origine du frontend si nécessaire.

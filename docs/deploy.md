# Déploiement

## PaaS (Render / Railway / Fly)
1. Créer un service Node.js et une base de données Postgres managée.
2. Définir les variables d'environnement à partir de `.env.production.example`.
3. Commande de démarrage : `npm run start:prod`.

## VPS / Docker
1. Copier `.env.online.staging.example` vers `.env.online.staging` et remplir les valeurs.
2. Lancer : `docker compose -f docker-compose.staging.yml up -d` dans `backend/`.
3. Après déploiement :
   ```bash
   npm --prefix backend run staging:postdeploy
   ```

## Frontend
Déployer le dossier `client` sur Vercel/Netlify et définir `VITE_API_BASE_URL` sur l'URL `BACKEND_BASE_URL` correspondante.

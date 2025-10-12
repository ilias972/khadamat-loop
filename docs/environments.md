# Environnements KhadamatPlatform

Ce guide décrit les attentes Ops pour chaque environnement ainsi que les commandes obligatoires. Toutes les étapes ci-dessous s'exécutent avec **Node.js ≥ 18** et `npm ci --ignore-scripts` pour garantir des builds reproductibles.

## Fichiers d'exemple & commandes rapides

| Environnement | Fichier(s) d'exemple | Commandes principales |
| ------------- | -------------------- | --------------------- |
| Local         | `.env.example`, `backend/.env.sample.local` | `npm run dev` (client + serveur mémoire), `npm --prefix backend run dev`, `npx prisma migrate dev --schema backend/prisma/schema.prisma`, `npm --prefix backend run seed`, `npm run ops:verify` |
| Staging       | `backend/.env.sample.staging` | `npm run build`, `npm run start:prod`, `npm run ci:check`, `npm run smoke:all`, `npm run ops:verify` |
| Production    | `backend/.env.sample.production` | `npm run build`, `npm run start:prod`, `npm run ci:check`, `npm run smoke:all`, `npm run ops:verify` |

> `server/` reste une pile de démonstration en mémoire. Il n'est lancé qu'en local via `npm run dev` et refuse tout démarrage si `NODE_ENV=production`. La pile **production** repose exclusivement sur `backend/` (Express + Prisma).

## Commandes communes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Lance Vite (`client/`) + serveur mémoire (`server/`). Garde-fou production intégré. |
| `npm run build` | Build monolithique : frontend Vite + backend Prisma. |
| `npm run start:prod` | Démarrage Express en mode production depuis `backend/dist`. |
| `npm run ci:check` | Lint/tests rapides de l'API. |
| `npm run smoke:all` | Campagne smoke stricte de `backend/`. |
| `npm run ops:verify` | Vérifie `/healthz` & `/readyz` (utilise `OPS_BACKEND_URL`, défaut `http://localhost:8080`). |
| `npm --prefix backend run dev` | API Prisma en développement. |
| `npm --prefix backend run seed` | Seed du catalogue Prisma (lit `.env`, `.env.local`, `.env.sample.local`). |
| `npx prisma migrate dev --schema backend/prisma/schema.prisma` | Migrations locales avant le seed. |

## Séquence de provisionnement (tous environnements)

1. Copier le gabarit `.env` adapté (`backend/.env.sample.*`).
2. Compléter **toutes** les variables critiques.
3. Exécuter `npx prisma migrate dev --schema backend/prisma/schema.prisma` (ou `prisma migrate deploy` en Postgres).
4. Lancer `npm --prefix backend run seed`.
5. Builder puis démarrer : `npm run build` → `npm run start:prod`.
6. Vérifier la santé : `npm run ops:verify` + requête `/metrics` avec le token.

## Variables critiques & validation

`backend/src/config/env.ts` exécute `validateEnv()` au démarrage. Résultat attendu :

- **Local** (`.env.sample.local`) : validation OK.
- **Production** : arrêt immédiat si une variable suivante manque ou est invalide :
  - Secrets : `JWT_SECRET`, `COOKIE_SECRET`.
  - Sécurité web : `CORS_ORIGINS` (HTTPS), `TRUST_PROXY=1`, `HSTS_ENABLED=true`, `HSTS_MAX_AGE`, `COOKIE_DOMAIN`.
  - Observabilité : `METRICS_TOKEN`, `SENTRY_DSN`.
  - Stockage/cache : `DATABASE_URL`, `SHADOW_DATABASE_URL`, `REDIS_URL`, `MOCK_REDIS=false`.
  - Antivirus : `UPLOAD_ANTIVIRUS=true`, `CLAMAV_HOST`, `CLAMAV_PORT`.
  - Paiement & KYC : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `KYC_PROVIDER`, `KYC_API_KEY`.
  - Notification : `SMTP_*`, `SMS_PROVIDER` + (`TWILIO_*` ou `VONAGE_*`).
  - Gouvernance : `ADMIN_IP_ALLOWLIST`.

Tout manquement génère un log explicite puis `process.exit(1)`.

## Santé & observabilité

- `/readyz` et `/healthz` retournent **200** uniquement si la base répond à `SELECT 1`.
- `npm run ops:verify` appelle automatiquement ces endpoints (`OPS_BACKEND_URL` configurable).
- `/metrics` retourne **200** seulement si l'en-tête `Authorization: Bearer ${METRICS_TOKEN}` est fourni ; sinon la route renvoie `401/403`.
- Définir `METRICS_TOKEN`, `SENTRY_DSN`, Redis, antivirus et HSTS en staging/production.

## Pipeline CI

Le workflow `.github/workflows/ci.yml` s'exécute sur chaque PR :

1. `npm ci --ignore-scripts`.
2. `npm run ci:check`.
3. `npm run smoke:all`.
4. `npx prisma migrate dev --schema backend/prisma/schema.prisma` + `npm --prefix backend run seed`.
5. `npm --prefix backend run build` puis `npm --prefix backend run start:prod` (en tâche de fond).
6. `npm run ops:verify` avec `OPS_BACKEND_URL` défini.
7. Requête `/metrics` avec le jeton.

Le job échoue dès qu'une étape retourne un code ≠ 0.

## Notes par environnement

- **Local** : SQLite, Redis mock (`MOCK_REDIS=true` par défaut), antivirus désactivé. `npm run dev` démarre client + serveur mémoire ; l'API réelle se lance via `npm --prefix backend run dev`.
- **Staging** : Postgres managé (`DATABASE_URL`, `SHADOW_DATABASE_URL`), Redis, ClamAV, Stripe test, SMTP sandbox, observabilité active. `METRICS_TOKEN` et `SENTRY_DSN` obligatoires.
- **Production** : Postgres HA, Redis haute dispo, ClamAV, Stripe live, SMTP live, alerting complet. `npm run build` → `npm run start:prod` suivis de `npm run ops:verify` et d'une requête `/metrics` avec le token sont requis avant tout go-live.

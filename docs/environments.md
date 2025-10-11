# Environnements KhadamatPlatform

Ce guide unifie les pratiques pour chaque environnement de la plateforme. Il couvre les variables actives, les services annexes et les commandes incontournables pour développer, tester et déployer en toute cohérence.

## Vue d'ensemble

| Environnement | Fichier d'exemple | Services clefs | Commandes prioritaires |
| ------------- | ----------------- | --------------- | ---------------------- |
| Local         | `.env.example`, `backend/.env.sample.local` | SQLite, Redis mock (optionnel), ClamAV désactivé | `npm run dev`, `npm run smoke:all`, `npm run ci:check` |
| Staging       | `backend/.env.sample.staging`               | Postgres managé, Redis, ClamAV actif, Stripe sandbox, SMTP sandbox | `npm run build`, `npm run smoke:all`, `npm run ci:check`, `npm run deploy` (pipeline) |
| Production    | `backend/.env.sample.production`            | Postgres HA, Redis, ClamAV actif, Stripe live, SMTP live, Observabilité complète | `npm run build`, `npm run start`, `npm run smoke:all`, `npm run ci:check`, `npm run deploy` |

### Services par environnement

- **Base de données**
  - Local : SQLite via `DATABASE_URL="file:./dev.db"`.
  - Staging : Postgres managé (`DATABASE_URL` & `SHADOW_DATABASE_URL`).
  - Production : Postgres HA avec sauvegardes (`DATABASE_URL`, `SHADOW_DATABASE_URL`, `BACKUP_*`).
- **Redis**
  - Local : optionnel via `MOCK_REDIS=true` ou `REDIS_URL` vers une instance docker.
  - Staging & Production : Redis obligatoire (`REDIS_URL`).
- **Antivirus / ClamAV**
  - Local : désactivé (`UPLOAD_ANTIVIRUS=false`).
  - Staging & Production : activé (`UPLOAD_ANTIVIRUS=true`, `CLAMAV_HOST`, `CLAMAV_PORT`).
- **Notifications**
  - SMTP/SMS facultatifs en local, sandbox en staging, comptes live en production.
- **Observabilité**
  - Sentry et métriques optionnels en local, obligatoires en staging/production (`SENTRY_DSN`, `METRICS_TOKEN`).

## Environnement local

- **Variables actives** : voir `.env.example` et `backend/.env.sample.local`. Elles couvrent l'API locale, Stripe test, Redis mock, ClamAV désactivé, secrets de développement.
- **Services associés** :
  - SQLite embarquée.
  - Redis mock ou conteneur local.
  - Aucun antivirus requis.
- **Commandes clefs** :
  - `npm run dev` – lance client + backend Prisma.
  - `npm run dev:frontend`, `npm run dev:backend` – exécutions indépendantes.
  - `npm run smoke:all` – vérifications fonctionnelles sur la pile locale.
  - `npm run ci:check` – lint/tests rapides alignés avec la CI.
  - `npm run seed` – insère les données Prisma de référence.

## Environnement staging

- **Variables actives** : utiliser `backend/.env.sample.staging` comme point de départ. Activer Postgres, Redis, ClamAV, Stripe test, SMTP sandbox, tokens d'administration (`ADMIN_*`, `SMOKE_*`).
- **Services associés** :
  - Postgres managé + `SHADOW_DATABASE_URL`.
  - Redis managé.
  - ClamAV (Docker ou service managé) avec `UPLOAD_ANTIVIRUS=true`.
  - Stripe test + KYC sandbox.
  - Sentry + métriques personnalisées.
- **Commandes clefs** :
  - `npm run build` – build client + backend.
  - `npm run ci:check` – vérifications pré-déploiement.
  - `npm run smoke:all` – campagne smoke obligatoire avant `deploy`.
  - `npm run seed` – déclenche `prisma db seed` pour provisionner staging.
  - Pipelines de déploiement : déclenchés sur `main` après succès des checks CI.

## Environnement production

- **Variables actives** : basées sur `backend/.env.sample.production` (toutes les variables critiques sont obligatoires : base de données, Redis, ClamAV, Stripe live, SMTP live, observabilité, sécurité réseau).
- **Services associés** :
  - Postgres HA + sauvegardes (`BACKUP_*`).
  - Redis haute dispo.
  - ClamAV actif et supervisé.
  - Stripe live + KYC.
  - Observabilité complète (Sentry, métriques, alertes).
- **Commandes clefs** :
  - `npm run build` puis `npm run start` pour lancer l'API.
  - `npm run ci:check` et `npm run smoke:all` – obligatoires avant tout go-live.
  - `npm run seed` – pour provisionner les données catalogues en cas de réinstallation.
  - `npm run deploy` (selon orchestrateur) après validation CI.

## Matrice des variables

| Variable | Local | Staging | Production |
| -------- | ----- | ------- | ---------- |
| `NODE_ENV` | `development` | `staging` | `production` |
| `DATABASE_URL` | SQLite locale | Postgres staging | Postgres production |
| `SHADOW_DATABASE_URL` | SQLite shadow | Postgres shadow | Postgres shadow |
| `REDIS_URL` | vide ou mock | Redis staging | Redis production |
| `UPLOAD_ANTIVIRUS` | `false` | `true` | `true` |
| `CLAMAV_HOST` / `CLAMAV_PORT` | non requis | requis | requis |
| `STRIPE_SECRET_KEY` | clé test | clé test | clé live |
| `STRIPE_WEBHOOK_SECRET` | optionnel | requis | requis |
| `SMTP_*` | optionnel | sandbox | live |
| `SMS_PROVIDER` + clés | optionnel | sandbox | live |
| `SENTRY_DSN` | optionnel | requis | requis |
| `METRICS_TOKEN` | optionnel | requis | requis |
| `TRUST_PROXY` | `0` | `1` | `1` |
| `HSTS_ENABLED` | `false` | `true` | `true` |
| `UPLOAD_STORAGE_DIR` | `./uploads` | stockage partagé | stockage durable |
| `BACKUP_*` | optionnel | activé (tests) | activé (critique) |
| `SMOKE_ROUTES_ENABLE` | `true` (local) | `false` | `false` |
| `ADMIN_IP_ALLOWLIST` | optionnel | restreint | obligatoire |
| `KYC_PROVIDER` & clés | optionnel | sandbox | production |
| `APP_BASE_URL` / `FRONTEND_URL` | `localhost` | staging | production |

> Toutes les variables sont validées au démarrage via `validateEnv()` dans `backend/src/config/env.ts`. Toute omission critique bloque l'application en staging/production.

## Procédures communes

1. Copier le fichier `.env.sample.<env>` adapté dans `backend/.env` (ou `backend/.env.production`).
2. Compléter toutes les variables sensibles.
3. Lancer `npm run ci:check` puis `npm run smoke:all`.
4. Déployer uniquement si les deux commandes passent.
5. Après migrations Prisma (`prisma migrate deploy`), exécuter `npm run seed` pour provisionner les catalogues.

**Initialisation des données**
Pour insérer les données de base (services, providers, catégories) :
`npm run seed --workspace backend`

Ce document sert de référence unique pour les équipes produit, QA et Ops.

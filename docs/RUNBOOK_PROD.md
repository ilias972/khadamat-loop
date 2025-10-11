# Runbook de Production

## 1. Préparation et contrôles préalables

- Lancer la batterie de vérification continue :
  ```bash
  npm run ci:check --workspace backend
  ```
- Vérifier que `npm run build` a produit `dist/` et que les artefacts sont archivés.
- Confirmer la disponibilité de l'environnement (CPU, mémoire, certificats TLS).

## 2. Gestion des sauvegardes

- **Sauvegarde récurrente** : planifier `npm run db:backup --workspace backend` suivi de `npm run db:backup:cleanup --workspace backend` (cron/PM2) en respectant `BACKUP_RETENTION_DAYS`.
- **Sauvegarde manuelle** :
  ```bash
  npm run db:backup --workspace backend
  sha256sum <dump> > <dump>.sha256
  ```
- **Tests de restauration** :
  - Vérifier l’intégrité : `sha256sum -c <dump>.sha256`.
  - Restaurer sur une base isolée (Postgres : `psql $PG_URL < dump.sql`, SQLite : copie du `.db`).
  - Exécuter `npx prisma migrate deploy` puis `npm run smoke:all --workspace backend` avant tout go-live.

## 3. Déploiement & migrations

1. Appliquer les migrations de schéma :
   ```bash
   npx prisma migrate deploy
   ```
2. Purger ou réchauffer les caches (`npm run ops:wait --workspace backend`, invalidation Redis si nécessaire).
3. Lancer l’application : `npm run start:prod` (ou via le PaaS/Docker correspondant).

## 4. Rotation des webhooks Stripe

1. Générer un nouveau secret depuis le dashboard Stripe (Events + Identity si utilisé).
2. Mettre à jour les variables `STRIPE_WEBHOOK_SECRET` et `STRIPE_IDENTITY_WEBHOOK_SECRET` dans l’outil de gestion des secrets.
3. Déployer l’application ou recharger la configuration.
4. Vérifier la réception des webhooks via `npm run ops:webhooks:verify --workspace backend`.

## 5. Checklist Go-Live

1. Variables d’environnement validées (API, frontend, Stripe, SMTP, Redis, ClamAV).
2. Base à jour (`npx prisma migrate deploy`).
3. Sauvegarde la plus récente horodatée et testée.
4. Webhooks Stripe actifs (test via `npm run online:payments --workspace backend`).
5. Comptes d’administration opérationnels (TOTP ou codes de récupération).
6. Tests fumée en ligne :
   ```bash
   npm run online:all:staging --workspace backend
   ```

## 6. Monitoring & rollback

- Monitoring : suivre Sentry, logs applicatifs (`winston`), métriques infra (CPU, RAM, I/O) et base (locks, connexions).
- Rollback : conserver l’image/commit N-1. En cas d’échec, restaurer la base (si modifiée) puis redéployer l’artefact précédent.

## 7. Post-déploiement

- Pipeline production : exécuter `npm run postdeploy:prod --workspace backend` après chaque mise en production.
- Staging :
  1. `npm run tokens:get:staging --workspace backend`
  2. `npm run postdeploy:staging --workspace backend`
  3. `npm run postdeploy:staging:online --workspace backend`

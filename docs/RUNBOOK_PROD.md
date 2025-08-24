# Runbook de Production

**Vérif pré-déploiement :** `npm run ci:check`

## URLs & Webhooks
- API: https://api.example.com
- Frontend: https://app.example.com
- Webhooks Stripe: secret via `STRIPE_WEBHOOK_SECRET`
- Webhooks KYC: secret via `STRIPE_IDENTITY_WEBHOOK_SECRET`
- Procédure de rotation: mettre à jour le secret dans l'outil distant puis dans l'environnement, redéployer.

## Sauvegarde / Restauration
- Sauvegarde quotidienne conseillée via cron/PM2 : `npm run db:backup` puis `npm run db:backup:cleanup` selon `BACKUP_RETENTION_DAYS`.
- Dump manuel : `npm run db:backup` puis `sha256sum <dump> > <dump>.sha256`.
- Restauration :
  - **SQLite** : `sha256sum -c <dump>.sha256` puis `cp <dump>.db ./dev.db && npx prisma migrate deploy`.
  - **Postgres** : `sha256sum -c <dump>.sha256` puis `psql $PG_URL < <dump>.sql && npx prisma migrate deploy`.

### Plan & test de restauration
- Générer un dump manuel : `npm run db:backup` puis `sha256sum <dump> > <dump>.sha256`.
- Purger les anciens dumps : `npm run db:backup:cleanup`.
- Vérifier l'intégrité : `sha256sum -c <dump>.sha256` avant restauration.
- Tester la restauration sur une base isolée puis lancer `npm run smoke:all` avant mise en prod.

## Rollback applicatif
- Conserver au moins un déploiement précédent.
- Pour revenir en arrière: redeployer l'image/commit précédent après restauration de la base si nécessaire.

## Monitoring & Alerting
- Vérifier Sentry pour les erreurs.
- Utiliser les métriques système (CPU, mémoire) et base de données.
- Alertes critiques par email ou Slack.

## Checklist de démarrage
1. Vérifier les variables d'environnement nécessaires (secrets, URLs).
2. Exécuter `prisma migrate deploy` avant le démarrage de l'application.
3. Confirmer la configuration des webhooks Stripe et KYC.
4. Purger/initialiser les caches si nécessaire.
5. Vérifier les pages légales et les paramètres de maintenance.

## Post-déploiement
- Après chaque déploiement en production, le pipeline doit appeler `npm run postdeploy:prod`.
- Ce script exécute la vérification GO-LIVE et doit faire échouer le pipeline en cas de `NO-GO`.

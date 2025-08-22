# Runbook de Production

## URLs & Webhooks
- API: https://api.example.com
- Frontend: https://app.example.com
- Webhooks Stripe: secret via `STRIPE_WEBHOOK_SECRET`
- Webhooks KYC: secret via `STRIPE_IDENTITY_WEBHOOK_SECRET`
- Procédure de rotation: mettre à jour le secret dans l'outil distant puis dans l'environnement, redéployer.

## Sauvegarde / Restauration
- Sauvegarde quotidienne via `BACKUP_CRON_SCHEDULE` vers `BACKUP_DIR`.
- Pour restaurer: stopper l'application, restaurer le dump puis relancer avec `prisma migrate deploy`.

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

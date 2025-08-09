# E2E Club Pro

1. Démarrer le serveur backend :
   ```bash
   npm --prefix backend run dev
   ```
2. Dans un autre terminal, écouter les webhooks Stripe :
   ```bash
   stripe listen --forward-to http://localhost:3000/api/payments/webhook
   ```
3. Générer les commandes cURL :
   ```bash
   npm --prefix backend run e2e:clubpro:curl
   ```
4. Exécuter les cURL affichés dans l'ordre pour :
   - enregistrer un fournisseur,
   - se connecter et récupérer le token,
   - créer un abonnement Club Pro en attente,
   - créer une session de paiement.

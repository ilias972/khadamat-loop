# 🏠 KhadamatPlatform - Plateforme de Services à Domicile

Une plateforme moderne de mise en relation entre clients et prestataires de services à domicile, développée avec React, TypeScript et Node.js.

## 🚀 Fonctionnalités Principales

### ✅ **Recherche Intelligente**
- Barre de recherche avec suggestions dynamiques
- Filtrage par service, ville et disponibilité
- Redirection automatique vers la page des artisans

### ✅ **Gestion des Prestataires**
- Profils détaillés avec photos et avis
- Système de badges (Vérifié, Club Pro)
- Calendrier de disponibilité dynamique
- Tri intelligent par disponibilité et note

### ✅ **Interface Multilingue**
- Support français et arabe
- Interface RTL pour l'arabe
- Traductions complètes

### ✅ **Pages Principales**
- **Accueil** : Recherche et prestataires en vedette
- **Artisans** : Liste avec filtres avancés
- **Profil Prestataire** : Détails et réservation
- **Club Pro** : Programme premium
- **À propos** : Présentation de la plateforme

## 📋 Prérequis

- **Node.js ≥ 18** (20 LTS recommandé)
- **npm** ou **yarn**
- **Git** (optionnel)

## 🛠️ Installation rapide

```bash
# 1. Installer les dépendances (Node ≥ 18 requis)
npm ci

# 2. Copier un fichier d'exemple pour l'environnement souhaité
cp backend/.env.sample.local backend/.env

# 3. Lancer la pile de démonstration (client + serveur mémoire)
npm run dev
```

La pile Prisma/Express (réelle) se lance séparément via `npm --prefix backend run dev`.

## 🔧 Commandes essentielles

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance Vite (`client/`) + serveur mémoire (`server/`). Refusé si `NODE_ENV=production`. |
| `npm run build` | Build monolithique : frontend Vite + backend Prisma (`backend/`). |
| `npm run start:prod` | Démarrage production (utilise `backend/dist` après build). |
| `npm run ci:check` | Lint + tests rapides (via `backend/scripts/ci`). |
| `npm run smoke:all` | Campagne smoke stricte de l'API (`backend`). |
| `npm run ops:verify` | Vérifie `/healthz` et `/readyz` (défaut : `http://localhost:8080`, override via `OPS_BACKEND_URL`). |
| `npm --prefix backend run dev` | API Prisma en mode développement (hot reload + SQLite). |
| `npm --prefix backend run seed` | Injection du jeu de données Prisma (utilise `.env`, `.env.local`, `.env.sample.local`). |
| `npx prisma migrate dev --schema backend/prisma/schema.prisma` | Migrations locales (SQLite ou Postgres) avant `seed`. |

Tous les scripts racine s'exécutent également dans la CI GitHub Actions (`npm ci --ignore-scripts`).

## 🔐 Variables d'environnement

Des fichiers d'exemple couvrent chaque scénario :

- `.env.example` : pile monolithique / démonstration (client + serveur mémoire).
- `backend/.env.sample.local` : configuration locale de référence pour Prisma (SQLite). Validée par `validateEnv()`.
- `backend/.env.sample.staging` : base staging (Postgres, Redis, ClamAV, Stripe test).
- `backend/.env.sample.production` : gabarit production (toutes les sécurités activées).
- `client/.env.production.example` : frontend statique pointant vers l'API.

Copiez le modèle adapté (`cp backend/.env.sample.local backend/.env`) puis complétez les secrets. `validateEnv()` (`backend/src/config/env.ts`) bloque tout démarrage si une variable critique manque en staging/production (`JWT_SECRET`, `COOKIE_SECRET`, CORS/HSTS, Redis, Stripe, SMTP, Sentry, métriques, antivirus...).

## 🚦 Démarrage & données locales

```bash
# Lancer le client + serveur mémoire (mode démo uniquement)
npm run dev

# Lancer l'API Prisma réelle (port 3000 par défaut)
npm --prefix backend run dev

# Exécuter les migrations et le seed (SQLite par défaut)
npx prisma migrate dev --schema backend/prisma/schema.prisma
npm --prefix backend run seed
```

Le serveur mémoire (`server/`) reste une pile de démonstration : il quitte immédiatement avec un code d'erreur si `NODE_ENV=production`.

## 🚀 Déploiement & exploitation

```bash
# Build monolithique
npm run build

# Démarrage production après build (Express + Prisma)
npm run start:prod

# Vérification automatique des endpoints de santé
npm run ops:verify           # (OPS_BACKEND_URL=http://127.0.0.1:8080 par défaut)
```

Séquence recommandée : **migrate → seed → start:prod**. En production, utilisez Postgres (`DATABASE_URL`, `SHADOW_DATABASE_URL`) puis `npm --prefix backend run seed` pour provisionner les catalogues.

## 🩺 Santé & observabilité

- `/readyz` & `/healthz` retournent `200` uniquement lorsque la base est accessible (`SELECT 1`). `npm run ops:verify` s'appuie dessus.
- `/metrics` est protégé : répondre `200` nécessite `Authorization: Bearer ${METRICS_TOKEN}`. Toute requête sans jeton reçoit `401/403`.
- `METRICS_TOKEN`, `SENTRY_DSN`, Redis, antivirus et HSTS sont obligatoires en production (`backend/.env.sample.production`).

## 🤖 CI & contrôles

Le workflow `.github/workflows/ci.yml` exécute :

1. `npm ci --ignore-scripts`
2. `npm run ci:check`
3. `npm run smoke:all`
4. Provision éphémère (`prisma migrate dev` + `seed`)
5. `npm run build` puis `npm run start:prod`
6. `npm run ops:verify` avec `OPS_BACKEND_URL`
7. Vérification `/metrics` (token requis)

La pipeline échoue dès qu'une étape retourne un code ≠ 0.

### 🔍 Vérification des services côté client

- `scripts/check-services.js` contrôle automatiquement l'absence de noms de services codés en dur dans `client/` lors du `prebuild`.
- Le contrôle est déclenché localement si `rg` (ripgrep) est disponible ; il est ignoré lorsque `CI=true` ou si l'outil est absent.
- Positionnez `CHECK_SERVICES=0` pour désactiver temporairement cette vérification.

## 📚 Documentation & Structure

- [Guide des environnements](docs/environments.md) — configurations local/staging/production, variables actives et procédures communes.

## 📁 Structure du Projet

```
khadamat-platform/
├── package.json              # Workspaces npm (client, server, backend)
├── client/                   # Frontend React/Vite
│   ├── package.json          # Dépendances UI
│   ├── vite.config.ts        # Config Vite spécifique au client
│   ├── tailwind.config.ts    # Config Tailwind CSS
│   ├── postcss.config.js     # Config PostCSS
│   └── src/                  # Code React
├── backend/                  # Backend production (Express + Prisma + Stripe + Redis + Sentry)
│   ├── package.json          # Scripts build/deploy + ops
│   ├── src/                  # Code TypeScript production
│   └── prisma/               # Schémas & migrations Postgres
├── server/                   # Backend DEMO (mode hors-production uniquement)
│   └── index.ts              # Quitte immédiatement si NODE_ENV=production
├── shared/                   # Schémas & utilitaires partagés (Drizzle + Zod)
└── docs/                     # Documentation détaillée
```

### 🧱 Piles backend

- **`backend/`** : pile officielle pour la production (Express + Prisma + Stripe + Redis + Sentry). Toutes les procédures de build, d'environnement et de déploiement sont documentées dans `backend/package.json` et `docs/`.
- **`server/`** : backend de démonstration en mémoire. Il n'est démarré que via `npm run dev` en local et refuse tout lancement si `NODE_ENV=production`.

## 🎯 Utilisation

### **Pour les Clients :**
1. **Recherche** : Utilisez la barre de recherche sur la page d'accueil
2. **Filtrage** : Sélectionnez service, ville et date sur la page Artisans
3. **Réservation** : Cliquez sur "Voir le profil" puis réservez

### **Pour les Prestataires :**
1. **Inscription** : Créez un compte prestataire
2. **Profil** : Complétez votre profil et disponibilités
3. **Club Pro** : Rejoignez le programme premium

## 🔧 Configuration

Les commandes et fichiers décrits plus haut constituent la référence unique pour configurer les environnements. Complétez systématiquement un fichier `.env` issu des gabarits `backend/.env.sample.*`, puis exécutez **migrate → seed → start:prod**. Pour plus de détails (modes local, staging, production, variables critiques), consultez `docs/environments.md`.

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour :
- **Desktop** : Écrans larges
- **Tablet** : Tablettes et petits écrans
- **Mobile** : Smartphones

## 🌐 Déploiement

### **Frontend (Vercel/Netlify)**
```bash
npm run build
# Déployer le dossier dist/public
```

### **Backend (Railway/Fly.io/Render)**
```bash
npm run build --workspace backend
npm run start:backend
```

## 🧪 Tests

Pour exécuter les tests du frontend :

```bash
cd client && npm test
```

## 🐛 Dépannage

### **Erreurs courantes :**

1. **Port déjà utilisé**
   ```bash
   # Changer le port dans client/vite.config.ts
   server: { port: 3001 }
   ```

2. **Dépendances manquantes**
   ```bash
   npm install
   ```

3. **Erreur de compilation TypeScript**
   ```bash
   npm run build
   # Vérifier les erreurs dans la console
   ```

## 📞 Support

Pour toute question ou problème :
- Vérifiez la console du navigateur
- Consultez les logs dans le dossier `logs/`
- Contactez l'équipe de développement

## 🔥 Smoke & Debug

Des scripts de smoke tests sont disponibles pour vérifier rapidement les points clés de l'API.

### Variables requises

- `BACKEND_BASE_URL` : URL de base du backend (défaut `http://localhost:3000`).
- `STRIPE_WEBHOOK_SECRET` : nécessaire pour `smoke:webhooks`.
- `SMOKE_TOKEN_CLIENT` : jeton JWT d'un utilisateur client pour `smoke:pii`.

### Résultats

- **PASS** : le test s'est exécuté et a reçu une réponse valide.
- **FAIL** : le test a rencontré une erreur inattendue.
- **SKIPPED** : prérequis manquants (ex. absence de secret ou de jeton).

### Exécution

```bash
npm run smoke:all
```

Chaque script est tolérant aux environnements vides : un `SKIPPED` n'est pas bloquant.

## 🛠 Mode dégradé local

Pour développer sans services externes, activer les variables `MOCK_EMAIL`, `MOCK_SMS`, `MOCK_REDIS` et `MOCK_STRIPE` dans `.env`.
Les envois simulés sont écrits dans le dossier `.outbox/` et les scénarios Stripe des smoke-tests seront `SKIPPED` si aucune clé n'est fournie.

## 🔒 Security audit

La commande `npm run audit:ci` tente d'exécuter `npm audit` et affiche un résumé des vulnérabilités. En environnement sans réseau, l'audit est ignoré proprement.

Pour activer un audit complet en CI, fournir un accès réseau sortant puis lancer `npm run audit:ci`. Les vulnérabilités jugées non bloquantes peuvent être ignorées de manière raisonnée via des fichiers de configuration (`npm audit fix --omit=dev` ou `.npmrc`).

## 📄 Licence

Ce projet est développé pour la plateforme Khadamat.

---

**Développé avec ❤️ pour connecter les clients aux meilleurs prestataires de services** 
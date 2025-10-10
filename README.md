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

- **Node.js** (version 18 ou supérieure, idéalement 20 LTS)
- **npm** ou **yarn**
- **Git** (optionnel)

## 🛠️ Installation

### 1. **Extraire le projet**
```bash
# Décompresser le fichier KhadamatPlatform.zip
# Ou cloner depuis Git si disponible
```

### 2. **Installer les dépendances**
```bash
# Dans le dossier racine du projet
npm install
```

### 3. **Lancer le serveur de développement**
```bash
# Pour la pile démo (Express + Vite)
npm run dev

# Pour lancer uniquement le frontend React
npm run dev:frontend

# Pour le backend de production
npm run dev:backend
```

### 4. **Accéder à l'application**
- Ouvrir votre navigateur
- Aller sur `http://localhost:5000` (pile démo)
- Ou sur `http://localhost:5173` si vous lancez seulement `npm run dev:frontend`

## 📁 Structure du Projet

```
khadamat-platform/
├── package.json              # Orchestration npm workspaces (client, server, backend)
├── client/                   # Frontend React/Vite
│   ├── package.json          # Dépendances UI
│   ├── vite.config.ts        # Config Vite spécifique au client
│   ├── tailwind.config.ts    # Config Tailwind CSS
│   ├── postcss.config.js     # Config PostCSS
│   └── src/                  # Code React
├── server/                   # Serveur Express de démonstration
│   ├── package.json          # Dépendances API mock + scripts esbuild/tsx
│   ├── index.ts              # Entrée Express
│   ├── routes.ts             # Routes REST mockées
│   └── vite.ts               # Intégration Vite côté serveur
├── backend/                  # Backend complet (Prisma, scripts ops)
│   └── package.json          # Dépendances production
├── shared/                   # Schémas & utilitaires partagés (Drizzle + Zod)
└── docs/fullstack-audit.md   # Documentation architecture
```

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

### **Variables d'environnement**

Des fichiers d'exemple sont fournis pour couvrir chaque brique :

- `.env.example` : pile monolithique / démo locale.
- `backend/.env.local.example` : exécution locale du backend Prisma.
- `backend/.env.production.example` : configuration de production réelle.
- `client/.env.production.example` : frontend statique pointant vers l'API.

Copiez le fichier approprié (ex. `cp .env.example .env`) puis adaptez les valeurs sensibles avant de lancer les services.

### Options Prisma (optionnel)
En cas de blocage du CDN Prisma, vous pouvez définir ces variables d'environnement (non commitées) :

```bash
PRISMA_ENGINES_MIRROR=https://prisma-builds.s3.us-east-2.amazonaws.com
PRISMA_CLI_QUERY_ENGINE_TYPE=binary
```

Ces variables sont lues par le `postinstall` et `scripts/check-prisma.js`.

### **Personnalisation**
- **Couleurs** : Modifiez `client/tailwind.config.ts`
- **Traductions** : Éditez `client/src/contexts/LanguageContext.tsx`
- **Données** : Modifiez les fichiers de données mockées

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

### **Backend (Heroku/Railway)**
```bash
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
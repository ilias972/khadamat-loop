# 🏠 Khadamat Platform

**Plateforme complète de services à domicile au Maroc**

Une application web fullstack moderne qui connecte les clients aux prestataires de services à domicile au Maroc. Système complet de réservation, messagerie, paiements et gestion d'entreprise.

**Technologies**: React + TypeScript (Frontend) • Node.js + Express + Prisma (Backend) • PostgreSQL/SQLite • JWT Auth • PWA Ready

---

## 🎯 Vue d'Ensemble

### **Objectif du Projet**
Khadamat Platform est une plateforme de mise en relation entre **clients** et **prestataires de services** à domicile au Maroc. Elle permet aux utilisateurs de trouver, réserver et payer des services (plomberie, électricité, ménage, jardinage, etc.) tout en offrant aux prestataires un espace professionnel pour gérer leur activité.

### **Fonctionnalités Principales**
- 🔍 **Recherche et réservation** de prestataires par catégorie/localisation
- 👤 **Gestion de comptes** multi-rôles (client/prestataire/admin)
- 💬 **Messagerie interne** temps réel entre clients et prestataires
- 💎 **Abonnements Club Pro** avec fonctionnalités premium
- ⭐ **Système d'avis et notations** bidirectionnel
- 📊 **Statistiques et suivi** des performances pour prestataires
- 🔔 **Notifications push** et alertes personnalisées
- 💳 **Paiements sécurisés** via Stripe (intégration prête)
- 🌐 **Interface multilingue** (Français/Arabe)
- 📱 **PWA** avec support mobile optimisé

---

## 🏗️ Architecture Fullstack

### **Vue Globale du Système**
```
┌─────────────────┐    HTTPS/WSS    ┌─────────────────┐    SQL    ┌─────────────────┐
│                 │ ◄──────────────► │                 │ ◄────────► │                 │
│   FRONTEND      │                 │    BACKEND      │           │   DATABASE      │
│   (React/TS)    │                 │  (Node.js/TS)   │           │ (PostgreSQL)    │
│                 │                 │                 │           │                 │
│ • Pages         │                 │ • API REST      │           │ • 12 Tables     │
│ • Components    │                 │ • Auth JWT      │           │ • Relations     │
│ • Contexts      │                 │ • Middlewares   │           │ • Migrations    │
│ • PWA           │                 │ • Services      │           │ • Constraints   │
└─────────────────┘                 └─────────────────┘           └─────────────────┘
        │                                   │
        └─────────────── API Calls ─────────┘
```

### **Communication Frontend ↔ Backend**
- **Authentification**: JWT tokens (access 15min + refresh 7j)
- **API REST**: Endpoints sécurisés avec validation Zod
- **Temps réel**: WebSockets pour messagerie et notifications
- **Upload**: Multipart pour images/fichiers
- **Paiements**: Webhooks Stripe pour confirmation

### **Structure des Dossiers Complète**
```
khadamat-platform/
├── 📁 backend/                    # Serveur Node.js + Express
│   ├── src/
│   │   ├── config/               # Configuration système
│   │   │   ├── database.ts       # Connexion Prisma + pool
│   │   │   ├── logger.ts         # Winston multi-niveaux
│   │   │   └── env.ts            # Variables d'environnement
│   │   ├── controllers/          # Logique métier par ressource
│   │   │   ├── authController.ts # Auth (register, login, verify)
│   │   │   ├── userController.ts # Gestion utilisateurs
│   │   │   ├── providerController.ts # Prestataires
│   │   │   ├── bookingController.ts  # Réservations
│   │   │   ├── messageController.ts  # Messagerie
│   │   │   └── paymentController.ts  # Paiements Stripe
│   │   ├── routes/               # Définition endpoints API
│   │   │   ├── auth.ts           # /api/auth/*
│   │   │   ├── users.ts          # /api/users/*
│   │   │   ├── providers.ts      # /api/providers/*
│   │   │   ├── bookings.ts       # /api/bookings/*
│   │   │   ├── messages.ts       # /api/messages/*
│   │   │   └── payments.ts       # /api/payments/*
│   │   ├── middlewares/          # Middleware Express
│   │   │   ├── auth.ts           # JWT + rôles + permissions
│   │   │   ├── errorHandler.ts   # Gestion erreurs centralisée
│   │   │   ├── validation.ts     # Validation Zod
│   │   │   └── rateLimit.ts      # Protection anti-spam
│   │   ├── utils/                # Fonctions utilitaires
│   │   │   ├── auth.ts           # JWT + bcrypt + tokens
│   │   │   ├── email.ts          # Envoi emails SMTP
│   │   │   ├── upload.ts         # Gestion fichiers
│   │   │   └── helpers.ts        # Fonctions génériques
│   │   ├── services/             # Intégrations externes
│   │   │   ├── stripe.ts         # Paiements
│   │   │   ├── email.ts          # SendGrid/Mailgun
│   │   │   ├── storage.ts        # AWS S3/local
│   │   │   └── notifications.ts  # Push notifications
│   │   └── server.ts             # Point d'entrée serveur
│   ├── prisma/                   # ORM Prisma
│   │   ├── schema.prisma         # Modèles + relations DB
│   │   ├── migrations/           # Historique migrations
│   │   └── seed.ts               # Données initiales
│   └── logs/                     # Fichiers de logs
│       ├── app.log               # Logs généraux
│       ├── error.log             # Erreurs uniquement
│       └── security.log          # Événements sécurité
├── 📁 client/                     # Application React
│   ├── src/
│   │   ├── components/           # Composants réutilisables
│   │   │   ├── layout/           # Header, Footer, Navigation
│   │   │   ├── ui/               # Shadcn/ui components
│   │   │   ├── providers/        # Cards prestataires
│   │   │   ├── services/         # Catalogue services
│   │   │   ├── messaging/        # Interface chat
│   │   │   └── auth/             # Formulaires auth
│   │   ├── pages/                # Pages principales
│   │   │   ├── Index.tsx         # Page d'accueil
│   │   │   ├── Login.tsx         # Connexion
│   │   │   ├── Register.tsx      # Inscription
│   │   │   ├── Providers.tsx     # Liste prestataires
│   │   │   ├── ProviderProfile.tsx # Détail prestataire
│   │   │   ├── Messages.tsx      # Messagerie
│   │   │   ├── Profile.tsx       # Profil utilisateur
│   │   │   ├── ClubPro.tsx       # Abonnements premium
│   │   │   └── MesReservations.tsx # Historique
│   │   ├── contexts/             # État global React
│   │   │   ├── AuthContext.tsx   # Authentification
│   │   │   ├── LanguageContext.tsx # i18n FR/AR
│   │   │   └── NotificationContext.tsx # Alerts
│   │   ├── hooks/                # Hooks personnalisés
│   │   │   ├── use-auth.ts       # Gestion auth
│   │   │   ├── use-api.ts        # Appels API
│   │   │   ├── use-toast.ts      # Notifications UI
│   │   │   └── use-geolocation.ts # GPS
│   │   ├── lib/                  # Utilitaires
│   │   │   ├── api.ts            # Client API centralisé
│   │   │   ├── utils.ts          # Helpers génériques
│   │   │   ├── validations.ts    # Schémas Zod frontend
│   │   │   └── constants.ts      # Constantes app
│   │   └── assets/               # Ressources statiques
│   │       ├── icons/            # Icônes SVG services
│   │       ├── images/           # Images optimisées
│   │       └── styles/           # CSS/Tailwind
│   ├── public/                   # Fichiers publics
│   │   ├── manifest.json         # PWA manifest
│   │   ├── sw.js                 # Service Worker
│   │   └── favicon.ico           # Favicon
│   └── index.html                # Point d'entrée HTML
├── 📁 shared/                     # Code partagé
│   ├── types.ts                  # Types TypeScript communs
│   ├── constants.ts              # Constantes globales
│   └── validations.ts            # Schémas Zod partagés
├── 📄 Configuration
│   ├── package.json              # Dépendances + scripts
│   ├── tsconfig.json             # Config TypeScript
│   ├── tailwind.config.ts        # Config Tailwind CSS
│   ├── vite.config.ts            # Config Vite (dev server)
│   ├── .env.example              # Template variables env
│   └── prisma/schema.prisma      # Schéma base de données
├── 📄 Scripts & Documentation
│   ├── README.md                 # Documentation complète
│   ├── start-dev.sh              # Démarrage développement
│   ├── stop-dev.sh               # Arrêt services
│   └── deploy.sh                 # Script déploiement
└── 📁 logs/                       # Logs application (gitignored)
```

---

## 🗄️ Base de Données (Prisma ORM)

### **Modèle de Données Complet**

La base de données utilise **12 tables principales** avec des relations optimisées :

```sql
-- 👤 UTILISATEURS
users (id, email, password, firstName, lastName, phone, avatar, role, isVerified, 
       twoFactorEnabled, twoFactorSecret, location, lastLoginAt, createdAt, updatedAt)

-- 🔧 PRESTATAIRES  
providers (id, userId, bio, specialties, experience, hourlyRate, rating, reviewCount,
           completedJobs, responseTime, isOnline, isVerified, badges, availability, 
           createdAt, updatedAt)

-- 🛠️ SERVICES
services (id, name, nameAr, description, descriptionAr, category, icon, isPopular,
          providerId, basePrice, createdAt, updatedAt)

-- 📅 RÉSERVATIONS
bookings (id, clientId, providerId, serviceId, title, description, scheduledDate,
          duration, location, price, status, notes, createdAt, updatedAt)

-- 💬 MESSAGES
messages (id, senderId, receiverId, bookingId, content, isRead, createdAt)

-- 💎 ABONNEMENTS
subscriptions (id, userId, type, status, startDate, endDate, price, features,
               autoRenew, stripeId, createdAt, updatedAt)

-- ⭐ AVIS
reviews (id, bookingId, userId, rating, comment, createdAt, updatedAt)

-- 🔔 NOTIFICATIONS
notifications (id, userId, type, title, message, data, isRead, createdAt)

-- ❤️ FAVORIS
favorites (id, userId, providerId, createdAt)

-- 🔑 TOKENS REFRESH
refresh_tokens (id, token, userId, expiresAt, createdAt)

-- 🛡️ SESSIONS
sessions (id, userId, ipAddress, userAgent, createdAt, expiresAt)

-- 📊 AUDIT LOGS
audit_logs (id, userId, action, resource, resourceId, oldValues, newValues,
            ipAddress, userAgent, createdAt)
```

### **Relations Entre Tables**
```
users (1) ──→ (1) providers
users (1) ──→ (n) bookings [as client]
users (1) ──→ (n) bookings [as provider] 
users (1) ──→ (n) messages [sent/received]
users (1) ──→ (n) subscriptions
users (1) ──→ (n) reviews
users (1) ──→ (n) notifications
users (1) ──→ (n) favorites
users (1) ──→ (n) refresh_tokens

providers (1) ──→ (n) services
providers (1) ──→ (n) favorites

bookings (1) ──→ (n) messages
bookings (1) ──→ (1) reviews

services (1) ──→ (n) bookings
```

### **Types d'Énumérations**
```typescript
enum UserRole { CLIENT, PROVIDER, ADMIN }
enum BookingStatus { PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED }
enum NotificationType { BOOKING_REQUEST, BOOKING_CONFIRMED, MESSAGE_RECEIVED, etc. }
enum SubscriptionType { CLUB_PRO, PREMIUM, ENTERPRISE }
enum SubscriptionStatus { ACTIVE, EXPIRED, CANCELLED, PENDING }
```

---

## 🔌 API Backend - Endpoints REST

### **🔐 Authentification - `/api/auth`**
```http
POST   /api/auth/register           # Inscription utilisateur
POST   /api/auth/login              # Connexion
POST   /api/auth/refresh            # Renouveler token
POST   /api/auth/logout             # Déconnexion
POST   /api/auth/verify-email       # Vérifier email
POST   /api/auth/resend-verification # Renvoyer code
POST   /api/auth/forgot-password    # Mot de passe oublié
POST   /api/auth/reset-password     # Réinitialiser MDP
GET    /api/auth/profile            # Profil utilisateur (protégé)
GET    /api/auth/security-info      # Infos sécurité (protégé)
POST   /api/auth/change-password    # Changer MDP (protégé)
```

**Exemple Inscription :**
```json
// POST /api/auth/register
{
  "email": "client@example.com",
  "password": "SecurePass123!",
  "firstName": "Ahmed",
  "lastName": "Benali",
  "phone": "+212612345678",
  "role": "CLIENT"
}

// Response
{
  "success": true,
  "data": {
    "user": { "id": 1, "email": "client@example.com", "role": "CLIENT" },
    "message": "Compte créé. Vérifiez votre email."
  }
}
```

### **👥 Utilisateurs - `/api/users`**
```http
GET    /api/users/:id               # Profil utilisateur (protégé)
PUT    /api/users/:id               # Modifier profil (protégé)
DELETE /api/users/:id               # Supprimer compte (admin)
GET    /api/users/:id/stats         # Statistiques (protégé)
```

### **🔧 Prestataires - `/api/providers`**
```http
GET    /api/providers               # Liste prestataires (public)
GET    /api/providers/:id           # Détail prestataire (public)
POST   /api/providers               # Devenir prestataire (protégé)
PUT    /api/providers/:id           # Modifier profil (protégé)
GET    /api/providers/search        # Recherche avancée (public)
GET    /api/providers/categories    # Par catégorie (public)
```

### **🛠️ Services - `/api/services`**
```http
GET    /api/services                # Catalogue services (public)
GET    /api/services/popular        # Services populaires (public)
GET    /api/services/category/:cat  # Par catégorie (public)
POST   /api/services                # Créer service (provider)
PUT    /api/services/:id            # Modifier (provider)
DELETE /api/services/:id            # Supprimer (provider)
```

### **📅 Réservations - `/api/bookings`**
```http
GET    /api/bookings                # Mes réservations (protégé)
POST   /api/bookings                # Nouvelle réservation (protégé)
GET    /api/bookings/:id            # Détail réservation (protégé)
PUT    /api/bookings/:id            # Modifier statut (protégé)
DELETE /api/bookings/:id            # Annuler (protégé)
```

**Exemple Réservation :**
```json
// POST /api/bookings
{
  "providerId": 2,
  "serviceId": 5,
  "title": "Réparation plomberie",
  "description": "Fuite robinet cuisine",
  "scheduledDate": "2025-01-15T14:00:00Z",
  "location": "Casablanca, Maarif",
  "duration": 120
}
```

### **💬 Messages - `/api/messages`**
```http
GET    /api/messages                # Mes conversations (protégé)
POST   /api/messages                # Envoyer message (protégé)
GET    /api/messages/conversation/:userId # Conversation avec utilisateur
PUT    /api/messages/:id/read       # Marquer comme lu (protégé)
```

### **💎 Abonnements - `/api/subscriptions`**
```http
GET    /api/subscriptions           # Mes abonnements (protégé)
POST   /api/subscriptions/club-pro  # S'abonner Club Pro (protégé)
PUT    /api/subscriptions/:id       # Modifier abonnement (protégé)
DELETE /api/subscriptions/:id       # Annuler abonnement (protégé)
```

### **⭐ Avis - `/api/reviews`**
```http
GET    /api/reviews/provider/:id    # Avis d'un prestataire (public)
POST   /api/reviews                 # Laisser un avis (protégé)
PUT    /api/reviews/:id             # Modifier mon avis (protégé)
DELETE /api/reviews/:id             # Supprimer mon avis (protégé)
```

### **🔔 Notifications - `/api/notifications`**
```http
GET    /api/notifications           # Mes notifications (protégé)
PUT    /api/notifications/:id/read  # Marquer comme lue (protégé)
DELETE /api/notifications/:id       # Supprimer (protégé)
```

### **❤️ Favoris - `/api/favorites`**
```http
GET    /api/favorites/:userId       # Mes favoris (protégé)
POST   /api/favorites               # Ajouter aux favoris (protégé)
DELETE /api/favorites               # Retirer des favoris (protégé)
GET    /api/favorites/check/:userId/:providerId # Vérifier si favori
```

### **💳 Paiements - `/api/payments`**
```http
POST   /api/payments/club-pro       # Paiement Club Pro (protégé)
GET    /api/payments/subscription/:userId # Historique paiements
POST   /api/payments/webhook        # Webhook Stripe (public)
```

### **📊 Statistiques - `/api/stats`**
```http
GET    /api/stats/user/:userId      # Stats utilisateur (protégé)
GET    /api/stats/provider/:providerId # Stats prestataire (protégé)
GET    /api/stats/admin             # Stats globales (admin)
```

### **🛡️ Middleware de Sécurité**
- **`authenticate`** : Vérification JWT obligatoire
- **`requireRole(...roles)`** : Contrôle des rôles
- **`requireOwnership`** : Accès aux propres données uniquement
- **`rateLimit`** : Protection anti-spam (10 req/15min)
- **`validateInput`** : Validation Zod des données
- **`errorHandler`** : Gestion centralisée des erreurs

### **Format Standard des Réponses**
```json
// Succès
{
  "success": true,
  "data": { /* résultats */ }
}

// Erreur
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Données invalides",
    "details": { /* détails erreur */ },
    "timestamp": "2025-01-08T12:00:00Z"
  }
}
```

---

## 🎨 Frontend - Pages & Composants

### **Pages Principales**
```typescript
// 🏠 Pages publiques
Index.tsx           // Accueil + recherche + services populaires
Providers.tsx       // Liste prestataires avec filtres
ProviderProfile.tsx // Détail prestataire + réservation
Services.tsx        // Catalogue complet des services
About.tsx          // À propos de la plateforme
Contact.tsx        // Formulaire de contact

// 🔐 Authentification
Login.tsx          // Connexion
Register.tsx       // Inscription
IdentityVerification.tsx // Vérification email

// 👤 Espace utilisateur (protégé)
Profile.tsx        // Profil + paramètres
MesReservations.tsx // Historique réservations
MesFavoris.tsx     // Prestataires favoris
Messages.tsx       // Messagerie temps réel
Parametre.tsx      // Paramètres compte

// 💎 Club Pro
ClubPro.tsx        // Page d'information abonnements
ClubProCheckout.tsx // Processus paiement

// 🔧 Prestataire
ProviderProfile.tsx // Profil prestataire
PostService.tsx    // Publier un service
Missions.tsx       // Gestion des missions
```

### **Composants Clés**
```typescript
// 🏗️ Layout
Header.tsx         // Navigation principale + auth
Footer.tsx         // Liens + infos légales
MobileHeader.tsx   // Version mobile
MobileBottomNav.tsx // Navigation mobile

// 🔍 Recherche
SmartSearch.tsx    // Barre recherche intelligente
ServiceCard.tsx    // Card service avec CTA
ProviderCard.tsx   // Card prestataire

// 👤 Utilisateur  
UserProfileMenu.tsx // Menu déroulant profil
ContactButton.tsx   // Bouton contact prestataire
BookingModal.tsx    // Modal de réservation

// 💬 Communication
ChatInterface.tsx   // Interface messagerie
NotificationBell.tsx // Cloche notifications

// 🎨 UI (Shadcn/ui)
Button, Card, Dialog, Input, Select, Toast, etc.
```

### **Contextes React (État Global)**
```typescript
// 🔐 AuthContext
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  register: (userData) => Promise<void>;
  updateProfile: (data) => Promise<void>;
}

// 🌍 LanguageContext  
interface LanguageContextType {
  language: 'fr' | 'ar';
  t: (key: string) => string;
  changeLanguage: (lang: 'fr' | 'ar') => void;
}

// 🔔 NotificationContext
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  addNotification: (notification) => void;
}
```

### **Hooks Personnalisés**
```typescript
// 🔐 Authentification
useAuth()          // Accès au contexte auth
useProtectedRoute() // Redirection si non connecté

// 🌐 API
useApi<T>(endpoint) // Appels API avec cache
useMutation(mutationFn) // Mutations avec loading
useInfiniteQuery() // Pagination infinie

// 🎨 UI
useToast()         // Notifications toast
useModal()         // Gestion modales
useLocalStorage()  // Persistance locale

// 📍 Géolocalisation
useGeolocation()   // GPS utilisateur
useNearbyProviders() // Prestataires à proximité
```

### **Gestion d'État & API**
```typescript
// 📡 Client API centralisé
const apiClient = {
  get<T>(url: string): Promise<T>
  post<T>(url: string, data: any): Promise<T>  
  put<T>(url: string, data: any): Promise<T>
  delete<T>(url: string): Promise<T>
}

// 🔄 React Query pour cache
const { data, isLoading, error } = useQuery({
  queryKey: ['providers', filters],
  queryFn: () => apiClient.get('/api/providers'),
  staleTime: 5 * 60 * 1000 // 5min cache
});

// 🔄 Mutations
const mutation = useMutation({
  mutationFn: (booking) => apiClient.post('/api/bookings', booking),
  onSuccess: () => queryClient.invalidateQueries(['bookings'])
});
```

---

## 🚀 Installation & Configuration

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Git
- PostgreSQL 13+ (production) ou SQLite (développement)

### **Installation Rapide**
```bash
# 1. Cloner le projet
git clone https://github.com/votre-repo/khadamat-platform.git
cd khadamat-platform

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos valeurs (voir section Configuration)

# 4. Initialiser la base de données
npm run db:generate    # Générer le client Prisma
npm run db:migrate     # Créer les tables

# 5. (Optionnel) Peupler avec des données de test
npm run db:seed

# 6. Démarrer l'application
./start-dev.sh         # Backend + Frontend automatique
# OU manuellement :
npm run dev           # Backend seul (port 4000)
npm run frontend      # Frontend seul (port 5173)
```

### **URLs de Développement**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000  
- **Health Check**: http://localhost:4000/health
- **Prisma Studio**: `npm run db:studio` (port 5555)

### **Configuration `.env`**
```bash
# Serveur
NODE_ENV=development
PORT=4000
HOST=localhost

# Base de données
DATABASE_URL="file:./dev.db"                    # SQLite (dev)
# DATABASE_URL="postgresql://user:pass@host:5432/khadamat" # PostgreSQL (prod)

# Sécurité JWT (OBLIGATOIRE À CHANGER EN PRODUCTION)
JWT_SECRET="khadamat_jwt_secret_32_chars_minimum_change_in_prod"
JWT_REFRESH_SECRET="khadamat_refresh_secret_32_chars_minimum_change_in_prod"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Sécurité générale
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000    # 15 minutes
RATE_LIMIT_MAX=100          # 100 requêtes max

# CORS
FRONTEND_URL="http://localhost:5173"
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"

# Email SMTP (optionnel en dev)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@khadamat.ma"

# Stripe (optionnel)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Logs
LOG_LEVEL=debug             # debug | info | warn | error

# Upload
MAX_FILE_SIZE=10485760      # 10MB
UPLOAD_PATH="./uploads"

# Redis (optionnel)
REDIS_URL="redis://localhost:6379"

# Notifications Push (optionnel)
VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PRIVATE_KEY="your_vapid_private_key" 
VAPID_SUBJECT="mailto:admin@khadamat.ma"
```

### **Scripts Disponibles**
```bash
# 🚀 Développement
./start-dev.sh          # Démarrage automatique complet
./stop-dev.sh           # Arrêt de tous les services
npm run dev             # Backend seul
npm run frontend        # Frontend seul

# 🗄️ Base de données
npm run db:generate     # Générer client Prisma
npm run db:migrate      # Appliquer migrations
npm run db:deploy       # Déployer en production
npm run db:seed         # Peupler données test
npm run db:reset        # Reset complet (DEV uniquement)
npm run db:studio       # Interface graphique Prisma

# 🔧 Build & Production
npm run build           # Build frontend + backend
npm start               # Démarrage production
npm run check           # Vérification TypeScript

# 🧪 Tests & Qualité
npm audit               # Audit sécurité dépendances
npm run lint            # Linter ESLint
npm run format          # Formater avec Prettier
```

---

## 🔐 Sécurité Implémentée

### **Authentification & Autorisation**
- **JWT sécurisé** : Access token (15min) + Refresh token (7j)
- **bcrypt** : Hashage mots de passe avec 12 rounds de salt
- **Vérification email** obligatoire avant activation compte
- **Rate limiting** : 10 tentatives de connexion / 15min par IP
- **Rôles & permissions** : CLIENT, PROVIDER, ADMIN avec contrôles stricts
- **Sessions côté serveur** : Tokens stockés en base avec expiration

### **Protection des APIs**
- **Middleware d'authentification** sur tous les endpoints sensibles
- **Validation Zod** stricte de tous les inputs utilisateur
- **Protection CORS** configurée pour domaines autorisés uniquement
- **Headers sécurisés** : Helmet avec CSP, HSTS, X-Frame-Options
- **Protection XSS/CSRF** : Sanitisation inputs + tokens CSRF

### **Base de Données**
- **Contraintes d'intégrité** : Foreign keys, unique constraints, checks
- **Audit trail** : Logs de toutes les actions utilisateurs importantes
- **Chiffrement** : Données sensibles chiffrées avant stockage
- **Gestion erreurs Prisma** : Pas de leak d'informations sensibles

### **Monitoring & Logs**
- **Logs structurés** : Winston avec niveaux (debug, info, warn, error)
- **Logs sécurité** : Tentatives connexion, actions suspectes
- **Surveillance temps réel** : Alertes sur activités anormales
- **Rotation logs** : Archivage automatique, limite taille fichiers

### **Protection Infrastructure**
- **Variables d'environnement** : Toutes les clés sensibles externalisées
- **Secrets management** : Rotation automatique des clés JWT
- **HTTPS obligatoire** : Redirection automatique en production
- **Firewall** : Restriction accès base de données

---

## 🌐 Déploiement Production

### **Préparation Déploiement**
```bash
# 1. Configuration environnement production
cp .env.example .env.production
# Éditer avec valeurs production (voir variables ci-dessous)

# 2. Build de l'application
npm run build

# 3. Migration base de données
npm run db:deploy

# 4. Test de démarrage
npm start
```

### **Variables d'Environnement Production**
```bash
# Serveur
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Base de données PostgreSQL (OBLIGATOIRE)
DATABASE_URL="postgresql://username:password@host:5432/khadamat_prod"

# Sécurité (OBLIGATOIRE À CHANGER)
JWT_SECRET="CHANGEZ_CETTE_CLE_32_CARACTERES_MINIMUM_PRODUCTION"
JWT_REFRESH_SECRET="CHANGEZ_CETTE_CLE_REFRESH_32_CARACTERES_MINIMUM_PROD"

# CORS Production
FRONTEND_URL="https://votre-domaine.com"
ALLOWED_ORIGINS="https://votre-domaine.com,https://www.votre-domaine.com"

# Email SMTP (OBLIGATOIRE)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="SG.votre_api_key_sendgrid"
FROM_EMAIL="noreply@votre-domaine.com"

# Stripe Production (si paiements)
STRIPE_SECRET_KEY="sk_live_votre_cle_stripe_production"
STRIPE_WEBHOOK_SECRET="whsec_votre_webhook_secret_production"

# Redis (recommandé)
REDIS_URL="redis://votre-redis-host:6379"

# Monitoring
LOG_LEVEL=info
SENTRY_DSN="https://votre-sentry-dsn"

# Stockage fichiers
AWS_S3_BUCKET="votre-bucket-s3"
AWS_ACCESS_KEY_ID="votre_access_key"
AWS_SECRET_ACCESS_KEY="votre_secret_key"
```

### **Déploiement avec PM2 (Recommandé)**
```bash
# 1. Installer PM2 globalement
npm install -g pm2

# 2. Créer fichier ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'khadamat-backend',
    script: 'backend/src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true
  }]
};
EOF

# 3. Démarrer avec PM2
pm2 start ecosystem.config.js
pm2 startup          # Démarrage automatique au boot
pm2 save            # Sauvegarder la configuration
```

### **Déploiement Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier package.json et installer dépendances
COPY package*.json ./
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Générer client Prisma
RUN npm run db:generate

# Exposer le port
EXPOSE 4000

# Démarrer l'application
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/khadamat
    depends_on:
      - db
      - redis
    
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: khadamat
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

### **Hébergeurs Recommandés**
- **Railway** : Déploiement automatique depuis Git
- **Render** : PostgreSQL + Redis inclus
- **DigitalOcean App Platform** : Scalabilité automatique
- **AWS/Google Cloud** : Maximum de contrôle
- **Vercel** (frontend) + **Railway** (backend) : Combo optimal

### **Checklist Pré-Déploiement**
- [ ] Variables d'environnement production configurées
- [ ] Base PostgreSQL créée et accessible
- [ ] Certificats SSL/TLS configurés (Let's Encrypt)
- [ ] DNS pointant vers le serveur
- [ ] SMTP configuré et testé
- [ ] Stripe configuré avec webhooks (si applicable)
- [ ] Monitoring configuré (Sentry, DataDog, etc.)
- [ ] Backup automatique base de données
- [ ] Firewall et sécurité serveur configurés

---

## 🔧 Maintenance & Évolutions

### **Ajouter une Nouvelle Fonctionnalité**

**1. Modification Base de Données :**
```bash
# Modifier le schéma Prisma
nano prisma/schema.prisma

# Générer et appliquer la migration
npm run db:migrate -- --name nouvelle_fonctionnalite
```

**2. Créer les Endpoints API :**
```typescript
// backend/src/controllers/nouvelleController.ts
export const createNouvelle = async (req: Request, res: Response) => {
  // Logique métier
};

// backend/src/routes/nouvelle.ts
router.post('/nouvelle', authenticate, asyncHandler(createNouvelle));

// backend/src/server.ts
app.use('/api/nouvelle', nouvelleRoutes);
```

**3. Frontend :**
```typescript
// client/src/pages/NouvellePage.tsx
export default function NouvellePage() {
  // Interface utilisateur
}

// client/src/lib/api.ts
export const nouvelleAPI = {
  create: (data) => apiClient.post('/api/nouvelle', data)
};
```

### **Mise à Jour Base de Données**
```bash
# Développement
npm run db:migrate

# Production
npm run db:deploy

# Rollback si problème
npm run db:migrate -- --rollback
```

### **Stratégie de Backup**
```bash
# Backup automatique PostgreSQL
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup avec compression
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restauration
psql $DATABASE_URL < backup_20250108_120000.sql
```

### **Monitoring & Alertes**
- **Métriques à surveiller** :
  - Temps de réponse API (< 200ms)
  - Taux d'erreur (< 1%)
  - Utilisation CPU/Mémoire (< 80%)
  - Connexions base de données
  - Espace disque disponible

- **Alertes critiques** :
  - Serveur down
  - Base de données inaccessible
  - Erreurs 500 répétées
  - Tentatives de connexion suspectes
  - Espace disque < 10%

### **Mise à Jour Sécurité**
```bash
# Audit régulier des dépendances
npm audit
npm audit fix

# Rotation des clés JWT (mensuelle)
# Générer nouvelles clés et redéployer

# Mise à jour Node.js/dépendances (trimestrielle)
npm update
npm run check
npm run build
```

### **Performance & Optimisation**
- **Cache Redis** : Données fréquemment consultées
- **CDN** : Images et assets statiques
- **Compression Gzip** : Réponses API
- **Index base de données** : Requêtes lentes
- **Pagination** : Listes importantes
- **Lazy loading** : Images et composants

---

## 🤝 Contribution & Support

### **Standards de Développement**
- **TypeScript strict** : Typage complet obligatoire
- **ESLint + Prettier** : Code formaté automatiquement
- **Commits conventionnels** : `feat:`, `fix:`, `docs:`, etc.
- **Tests unitaires** : Coverage minimum 80%
- **Documentation** : JSDoc pour toutes les fonctions

### **Workflow Git**
```bash
# 1. Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer et tester
npm run check
npm run lint
npm run build

# 3. Commit avec message conventionnel
git commit -m "feat: ajouter système de notifications push"

# 4. Push et créer PR
git push origin feature/nouvelle-fonctionnalite
```

### **Support & Documentation**
- **Issues GitHub** : Bugs et demandes de fonctionnalités
- **Discussions** : Questions générales
- **Wiki** : Documentation technique avancée
- **Email** : support@khadamat.ma

---

## 📄 Licence & Informations

**Licence** : MIT License  
**Version** : 2.0.0 (Architecture Production)  
**Dernière mise à jour** : Janvier 2025  
**Auteur** : Équipe Khadamat Platform  

### **Technologies Utilisées**
- **Frontend** : React 18, TypeScript, Tailwind CSS, Shadcn/ui, Wouter, TanStack Query
- **Backend** : Node.js, Express, TypeScript, Prisma ORM, Winston, Zod
- **Base de données** : PostgreSQL (prod) / SQLite (dev)
- **Authentification** : JWT, bcrypt, refresh tokens
- **Sécurité** : Helmet, CORS, rate limiting, validation
- **DevOps** : PM2, Docker, GitHub Actions
- **Monitoring** : Sentry, logs structurés

---

## 🎯 État du Projet

### **✅ Fonctionnalités Implémentées**
- [x] Architecture fullstack complète
- [x] Authentification JWT sécurisée  
- [x] Base de données Prisma avec 12 tables
- [x] API REST complète (30+ endpoints)
- [x] Interface React moderne et responsive
- [x] Système de rôles et permissions
- [x] Logging et monitoring intégrés
- [x] Scripts de déploiement automatisés
- [x] Documentation technique complète

### **🚧 En Développement**
- [ ] Messagerie temps réel (WebSockets)
- [ ] Notifications push (Service Worker)
- [ ] Paiements Stripe intégrés
- [ ] Upload fichiers S3
- [ ] Tests automatisés (Jest/Cypress)

### **🔮 Roadmap Future**
- [ ] Application mobile (React Native)
- [ ] Intelligence artificielle (recommandations)
- [ ] Géolocalisation avancée
- [ ] Marketplace étendu
- [ ] API publique pour partenaires

---

**🏆 Khadamat Platform - Votre plateforme de services à domicile au Maroc**

*Connecter les clients aux meilleurs prestataires, en toute sécurité et simplicité.*
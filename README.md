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

- **Node.js** (version 16 ou supérieure)
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
# Pour le frontend (React)
npm run frontend

# Pour le backend (si nécessaire)
npm run dev
```

### 4. **Accéder à l'application**
- Ouvrir votre navigateur
- Aller sur `http://localhost:5173`

## 📁 Structure du Projet

```
KhadamatPlatform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── contexts/      # Contextes React
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── lib/           # Utilitaires et configurations
│   └── index.html
├── server/                # Backend Node.js
├── shared/                # Code partagé
└── package.json
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
Créez un fichier `.env` à la racine :
```env
NODE_ENV=development
PORT=3000
```

### **Personnalisation**
- **Couleurs** : Modifiez `tailwind.config.ts`
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
# Déployer le dossier dist/
```

### **Backend (Heroku/Railway)**
```bash
npm start
```

## 🐛 Dépannage

### **Erreurs courantes :**

1. **Port déjà utilisé**
   ```bash
   # Changer le port dans vite.config.ts
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

## 📄 Licence

Ce projet est développé pour la plateforme Khadamat.

---

**Développé avec ❤️ pour connecter les clients aux meilleurs prestataires de services** 
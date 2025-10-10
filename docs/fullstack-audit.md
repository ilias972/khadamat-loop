# Audit Fullstack

## 1. Architecture actuelle

### Monorepo npm
- **Gestionnaire** : npm workspaces (définis dans `package.json`).
- **Workspaces** :
  - `client/` – application React/Vite destinée au frontend.
  - `server/` – serveur Express léger utilisé pour la démonstration locale et l’orchestration du SPA.
  - `backend/` – backend Node/Express complet utilisé pour la production.
- **Scripts racine** : `npm run dev`, `npm run build`, `npm run start`, etc. délèguent aux workspaces `client` et `server`. Des alias existent pour cibler directement chaque pile (`dev:frontend`, `dev:server`, `dev:backend`, `start:backend`, …).

### Frontend (`client/`)
- Stack : React 18 + TypeScript + Vite + TailwindCSS.
- Config dédiée dans `client/vite.config.ts`, `client/tailwind.config.ts` et `client/postcss.config.js`.
- Dépendances UI/état (Radix UI, TanStack Query, etc.) déclarées dans `client/package.json`.
- Scripts : `npm run dev` lance Vite, `npm run build` produit `dist/public/` (utilisé par `server`), `npm run lint` exécute `tsc --noEmit`.

### Serveur de démonstration (`server/`)
- Stack : Express 4 + TypeScript.
- Fournit l’API mock et sert le build Vite via `server/vite.ts`.
- Scripts :
  - `npm run dev --workspace server` (via racine) exécute `tsx index.ts` avec Vite en middleware.
  - `npm run build --workspace server` transpile via `esbuild` vers `dist/index.js`.
  - `npm run db:push --workspace server` exécute `drizzle-kit push` sur les schémas in-memory.
- Dépendances de sécurité : rate limiting, Helmet, JWT, Stripe, Nodemailer, Redis (optionnel).

### Backend de production (`backend/`)
- Conservé tel quel : architecture complète Prisma + scripts d’exploitation.
- Accessible via les scripts racine `dev:backend`, `start:backend`, `backend:ops:verify`, etc.
- Non couplé au serveur de démonstration ; partage les types via `shared/`.

### Code partagé
- `shared/` expose schémas et utilitaires (Drizzle ORM + Zod) utilisés par `client` et `server`.
- Les alias TypeScript/Vite `@shared` sont configurés dans `client/vite.config.ts` et `tsconfig.json`.

### Flux de build & exécution
- `npm run dev` → démarre Express (`server/`) qui monte Vite (`client/`).
- `npm run build` → exécute successivement `client` puis `server`; le bundle frontend vit dans `dist/public`, l’API dans `dist/index.js`.
- `npm run start` → lance `node dist/index.js` via le workspace `server` (mode prod démo).
- Les environnements production continuent d’utiliser `backend/` et ses scripts existants (`npm run dev:backend`, `npm run start:backend`, etc.).

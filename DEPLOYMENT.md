# Guide de Déploiement GendBuntu

## Prérequis

- Compte Railway (backend + base de données)
- Compte Vercel (frontend)
- Compte Discord (pour les webhooks)
- Repository GitHub

## Déploiement Backend (Railway)

### 1. Créer un projet Railway

1. Aller sur [railway.app](https://railway.app)
2. Créer un nouveau projet
3. Connecter votre repository GitHub

### 2. Ajouter PostgreSQL

1. Dans votre projet Railway, cliquer sur "New"
2. Sélectionner "Database" → "PostgreSQL"
3. Railway créera automatiquement une base de données

### 3. Configurer le service Backend

**IMPORTANT** : Il y a deux méthodes pour configurer Railway :

#### Méthode A : Root Directory (Recommandé)

1. Ajouter un nouveau service "GitHub Repo"
2. Sélectionner votre repository
3. **Dans Settings → Source → Root Directory** : définir `backend`
4. Railway utilisera automatiquement le dossier `backend` comme racine
5. Railway détectera automatiquement NestJS et `nixpacks.toml`

#### Méthode B : Dockerfile

1. Ajouter un nouveau service "GitHub Repo"
2. Sélectionner votre repository
3. **Dans Settings → Build → Builder** : sélectionner "Dockerfile"
4. **Dockerfile Path** : `backend/Dockerfile`
5. Railway utilisera le Dockerfile pour le build

### 4. Variables d'environnement

Dans les paramètres du service backend, ajouter :

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your-webhook-url
BCRYPT_ROUNDS=10
```

**Note**: Railway injecte automatiquement `DATABASE_URL` depuis la base de données PostgreSQL.

### 5. Build et Deploy

Railway exécutera automatiquement :
1. `npm install`
2. `npx prisma generate`
3. `npm run build`
4. `npm run start:prod`

### 6. Configurer le Root Directory (IMPORTANT)

**Cette étape est cruciale pour éviter l'erreur "cd backend: No such file or directory"**

1. Dans Railway Dashboard, aller dans votre service backend
2. Cliquer sur **Settings** → **Source**
3. Dans **Root Directory**, entrer : `backend`
4. Sauvegarder

Railway utilisera maintenant directement le dossier `backend` comme racine du projet.

### 7. Migrations Prisma

Après le premier déploiement, exécuter les migrations :

```bash
# Via Railway CLI (depuis la racine du projet)
railway run --service your-backend-service npx prisma migrate deploy

# Ou via Railway Dashboard → Deployments → Run Command
# Commande: npx prisma migrate deploy
```

### 7. Seed de la base de données (optionnel)

```bash
railway run npm run prisma:seed
```

## Déploiement Frontend (Vercel)

### 1. Créer un projet Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Importer votre repository GitHub
3. Vercel détectera automatiquement Next.js

### 2. Configuration

**Root Directory**: `frontend`

**Build Command**: `npm run build`

**Output Directory**: `.next`

### 3. Variables d'environnement

Dans les paramètres du projet Vercel :

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

**Important**: Remplacer `your-backend.railway.app` par l'URL réelle de votre backend Railway.

### 4. Déploiement

Vercel déploiera automatiquement à chaque push sur la branche principale.

## Configuration Discord Webhook

### 1. Créer un webhook Discord

1. Aller dans les paramètres de votre serveur Discord
2. Intégrations → Webhooks
3. Créer un nouveau webhook
4. Copier l'URL du webhook

### 2. Ajouter l'URL dans Railway

Ajouter `DISCORD_WEBHOOK_URL` dans les variables d'environnement du backend.

## URLs Finales

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app/api`
- **API Docs**: `https://your-backend.railway.app/api/docs`

## Vérification

### Backend

1. Vérifier que l'API répond : `https://your-backend.railway.app/api`
2. Vérifier Swagger : `https://your-backend.railway.app/api/docs`
3. Tester l'authentification : `POST /api/auth/login`

### Frontend

1. Accéder à `https://your-app.vercel.app`
2. Vérifier la redirection vers `/login`
3. Tester la connexion avec les comptes de seed

## Troubleshooting

### Backend ne démarre pas

- Vérifier les variables d'environnement
- Vérifier les logs Railway
- Vérifier que Prisma a généré le client (`npx prisma generate`)

### Frontend ne peut pas se connecter au backend

- Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
- Vérifier CORS dans le backend (`FRONTEND_URL`)
- Vérifier que le backend est accessible publiquement

### Erreurs de base de données

- Vérifier que les migrations ont été exécutées
- Vérifier `DATABASE_URL` dans Railway
- Vérifier les logs Prisma

## Maintenance

### Mises à jour

1. Pousser les changements sur GitHub
2. Railway et Vercel déploieront automatiquement
3. Si changement de schéma Prisma :
   - Créer une migration : `npx prisma migrate dev --name description`
   - Déployer la migration : `railway run npx prisma migrate deploy`

### Backups

Railway propose des backups automatiques de PostgreSQL. Configurer dans les paramètres de la base de données.

## Sécurité Production

⚠️ **Important avant la mise en production** :

1. Changer tous les secrets JWT (utiliser des générateurs sécurisés)
2. Configurer HTTPS (automatique avec Railway et Vercel)
3. Activer les rate limits (déjà configuré)
4. Configurer les logs d'audit
5. Mettre en place un monitoring
6. Configurer les alertes
7. Réviser les permissions et rôles

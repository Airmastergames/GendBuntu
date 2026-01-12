# 🚂 Configuration Railway - Guide Complet

## ⚠️ IMPORTANT : Configuration Requise

**AVANT de déployer sur Railway, vous DEVEZ configurer le Root Directory !**

## 📋 Étapes de Configuration

### 1. Créer le Service sur Railway

1. Allez sur [railway.app](https://railway.app)
2. Créez un nouveau projet
3. Cliquez sur **"New"** → **"GitHub Repo"**
4. Sélectionnez votre repository

### 2. ⭐ CONFIGURER LE ROOT DIRECTORY (OBLIGATOIRE)

**C'EST L'ÉTAPE LA PLUS IMPORTANTE - NE LA SAUTEZ PAS !**

1. Dans votre service Railway, cliquez sur **Settings** (⚙️)
2. Cliquez sur **Source** dans le menu de gauche
3. Dans **Root Directory**, entrez : `backend`
4. Cliquez sur **Save**

**Sans cette étape, vous aurez l'erreur "cd backend: No such file or directory" !**

### 3. Ajouter PostgreSQL

1. Dans votre projet Railway, cliquez sur **"New"**
2. Sélectionnez **"Database"** → **"PostgreSQL"**
3. Railway créera automatiquement une base de données

### 4. Configurer les Variables d'Environnement

Dans votre service backend → **Variables**, ajoutez :

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=votre-secret-jwt-min-32-caracteres
JWT_REFRESH_SECRET=votre-secret-refresh-min-32-caracteres
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/votre-webhook
BCRYPT_ROUNDS=10
```

**Note** : `${{Postgres.DATABASE_URL}}` sera automatiquement remplacé par Railway avec l'URL de votre base PostgreSQL.

### 5. Déployer

Railway détectera automatiquement :
- `backend/package.json`
- `backend/nixpacks.toml` (configuration de build)
- `backend/railway.json` (configuration Railway)

Le build s'exécutera automatiquement depuis le dossier `backend/`.

### 6. Exécuter les Migrations

Après le premier déploiement :

1. Allez dans **Deployments**
2. Cliquez sur les **3 points** → **"Run Command"**
3. Entrez : `npx prisma migrate deploy`
4. Cliquez sur **Run**

### 7. Seed la Base de Données (Optionnel)

1. Dans **Deployments** → **Run Command**
2. Entrez : `npm run prisma:seed`
3. Cliquez sur **Run**

## ✅ Vérification

Après le déploiement :

1. ✅ Vérifiez les logs Railway (pas d'erreur "cd backend")
2. ✅ Testez l'API : `https://votre-app.railway.app/api`
3. ✅ Testez Swagger : `https://votre-app.railway.app/api/docs`

## 🐛 Dépannage

### Erreur "cd backend: No such file or directory"

**Solution** : Configurez le Root Directory à `backend` dans Settings → Source

### Erreur de connexion à la base de données

**Solution** : Vérifiez que `DATABASE_URL=${{Postgres.DATABASE_URL}}` est bien configuré

### Build échoue

**Solution** : Vérifiez les logs Railway pour voir l'erreur exacte

## 📚 Fichiers de Configuration

- `backend/railway.json` - Configuration Railway
- `backend/nixpacks.toml` - Configuration de build Nixpacks
- `backend/Dockerfile` - Alternative Docker (si Nixpacks ne fonctionne pas)

## 🎯 Résumé

**La clé du succès** : Configurer **Root Directory = `backend`** dans Railway Settings → Source !

Sans cette configuration, Railway essaiera d'exécuter `cd backend` depuis la racine, ce qui échouera.

# Configuration Railway - Guide de Dépannage

## Problème : "cd backend: No such file or directory"

Railway essaie d'exécuter `cd backend` mais le contexte de build ne contient pas ce répertoire.

## Solutions

### Solution 1 : Configurer Root Directory (RECOMMANDÉ - Plus Simple)

**C'est la solution la plus simple et la plus fiable :**

1. Dans Railway Dashboard :
   - Allez dans votre service backend
   - Cliquez sur **Settings** → **Source**
   - Dans **Root Directory**, entrez : `backend`
   - Sauvegarder

2. Railway utilisera maintenant directement le dossier `backend` comme racine
3. Railway détectera automatiquement :
   - `package.json`
   - `nixpacks.toml` (si présent)
   - `Dockerfile` (si présent)

4. Les commandes de build seront exécutées depuis `backend/` automatiquement

**C'est la méthode recommandée car elle évite tous les problèmes de chemin !**

### Solution 2 : Utiliser le Dockerfile

1. **Dans Railway Dashboard** :
   - Allez dans les paramètres de votre service
   - Section "Build"
   - Changez "Build Command" pour utiliser le Dockerfile
   - Ou supprimez la commande de build personnalisée

2. **Configuration Railway** :
   - Le fichier `railway.json` est déjà configuré pour utiliser `backend/Dockerfile`
   - Railway devrait détecter automatiquement le Dockerfile

3. **Si Railway ne détecte pas le Dockerfile** :
   - Dans Railway Dashboard → Settings → Build
   - Sélectionnez "Dockerfile" comme builder
   - Spécifiez le chemin : `backend/Dockerfile`

### Solution 3 : Utiliser Nixpacks avec configuration

1. Le fichier `backend/nixpacks.toml` est déjà créé
2. Dans Railway, configurez le Root Directory à `backend`
3. Railway utilisera automatiquement `nixpacks.toml`

## Étapes de Configuration Railway

### Option A : Root Directory = `backend` ⭐ RECOMMANDÉ

1. Créer un nouveau service Railway
2. Connecter votre repository GitHub
3. Dans Settings → Source → Root Directory : `backend`
4. Railway détectera automatiquement `package.json` et `nixpacks.toml`
5. Ajouter PostgreSQL comme service séparé
6. Configurer les variables d'environnement

### Option B : Utiliser Dockerfile

1. Créer un nouveau service Railway
2. Connecter votre repository GitHub
3. Dans Settings → Build → Builder : `Dockerfile`
4. Dockerfile Path : `backend/Dockerfile`
5. Ajouter PostgreSQL comme service séparé
6. Configurer les variables d'environnement

## Variables d'Environnement Requises

Dans Railway → Variables :

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
BCRYPT_ROUNDS=10
```

## Vérification

Après le déploiement :

1. Vérifier les logs Railway
2. Vérifier que l'API répond : `https://your-app.railway.app/api`
3. Vérifier Swagger : `https://your-app.railway.app/api/docs`

## Si le problème persiste

1. Vérifier que le repository contient bien le dossier `backend/`
2. Vérifier que `backend/package.json` existe
3. Vérifier que `backend/prisma/schema.prisma` existe
4. Vérifier les logs Railway pour plus de détails
5. Essayer de supprimer et recréer le service Railway

# 🔧 Solution Définitive pour Railway

## Le Problème

```
/bin/bash: line 1: cd: backend: No such file or directory
```

Railway essaie d'exécuter `cd backend` mais le contexte de build ne contient pas ce répertoire.

## ✅ Solution en 2 Étapes

### Étape 1 : Configurer Root Directory dans Railway

**C'EST LA SOLUTION PRINCIPALE - À FAIRE EN PREMIER :**

1. Ouvrez **Railway Dashboard**
2. Sélectionnez votre **service backend**
3. Allez dans **Settings** (⚙️ en haut à droite)
4. Cliquez sur **Source** dans le menu de gauche
5. Dans **Root Directory**, entrez : `backend`
6. Cliquez sur **Save**

**Railway utilisera maintenant directement le dossier `backend` comme racine !**

### Étape 2 : Vérifier la Configuration

Après avoir configuré le Root Directory, Railway devrait :
- ✅ Détecter automatiquement `backend/package.json`
- ✅ Utiliser `backend/nixpacks.toml` pour le build
- ✅ Exécuter les commandes depuis `backend/` automatiquement

### Étape 3 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur **Redeploy** ou poussez un nouveau commit

## 📋 Vérification

Après le redéploiement, vérifiez les logs Railway. Vous devriez voir :

```
✓ Installing dependencies
✓ Generating Prisma Client
✓ Building application
✓ Starting server
```

Au lieu de :
```
✗ cd backend: No such file or directory
```

## 🎯 Si ça ne fonctionne toujours pas

### Option A : Supprimer et Recréer le Service

1. Dans Railway, supprimez le service backend actuel
2. Créez un nouveau service "GitHub Repo"
3. **IMMÉDIATEMENT** après la création, configurez Root Directory = `backend`
4. Ajoutez PostgreSQL comme service séparé
5. Configurez les variables d'environnement
6. Redéployez

### Option B : Utiliser Dockerfile

Si Nixpacks ne fonctionne pas :

1. Dans Railway → Settings → Build
2. Builder : **Dockerfile**
3. Dockerfile Path : `backend/Dockerfile` (ou laissez vide si Root Directory = backend)
4. Le Dockerfile est déjà créé dans `backend/Dockerfile`

## 📝 Variables d'Environnement Requises

N'oubliez pas de configurer ces variables dans Railway → Variables :

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

## ✅ Checklist

- [ ] Root Directory configuré à `backend` dans Railway
- [ ] PostgreSQL ajouté comme service
- [ ] Variables d'environnement configurées
- [ ] Service redéployé
- [ ] Logs vérifiés (pas d'erreur "cd backend")
- [ ] API accessible : `https://your-app.railway.app/api`
- [ ] Swagger accessible : `https://your-app.railway.app/api/docs`

## 🆘 Support

Si le problème persiste après avoir configuré Root Directory :

1. Vérifiez que le dossier `backend/` existe dans votre repository GitHub
2. Vérifiez que `backend/package.json` existe
3. Vérifiez que `backend/prisma/schema.prisma` existe
4. Consultez les logs Railway complets pour plus de détails
5. Essayez de supprimer et recréer le service

**La configuration du Root Directory est la solution principale !** 🎯

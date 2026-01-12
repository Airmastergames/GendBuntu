# 🔧 Solution Complète pour Railway Build

## ⚠️ Le Problème

Railway ne build pas correctement avec l'erreur :
```
cd backend: No such file or directory
```

## ✅ Solution Complète en 4 Étapes

### Étape 1 : Configurer Root Directory (OBLIGATOIRE)

1. **Railway Dashboard** → votre service backend
2. **Settings** (⚙️) → **Source**
3. **Root Directory** : `backend`
4. **Save**

**C'est l'étape la plus importante !** Sans ça, rien ne fonctionnera.

### Étape 2 : Vérifier la Configuration Build

1. **Settings** → **Build**
2. **Builder** : `Nixpacks` (ou `Dockerfile` si vous préférez)
3. **Build Command** : Laissez vide (Nixpacks utilisera `nixpacks.toml`)
4. **Start Command** : `npm run start:prod`

### Étape 3 : Variables d'Environnement

Dans **Settings** → **Variables**, ajoutez :

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

### Étape 4 : Redéployer

1. **Deployments** → **Redeploy**
2. Ou poussez un nouveau commit sur GitHub

## 📋 Vérification du Build

Après le redéploiement, les logs Railway devraient montrer :

```
✓ Detecting Nixpacks
✓ Installing Node.js 18
✓ Installing dependencies
✓ Generating Prisma Client
✓ Building application
✓ Starting server
```

**Sans** l'erreur `cd backend: No such file or directory`.

## 🐛 Si ça ne fonctionne toujours pas

### Option A : Supprimer et Recréer le Service

1. Supprimez le service backend actuel
2. Créez un nouveau service "GitHub Repo"
3. **IMMÉDIATEMENT** après création, configurez Root Directory = `backend`
4. Configurez les variables d'environnement
5. Redéployez

### Option B : Utiliser Dockerfile

1. **Settings** → **Build**
2. **Builder** : `Dockerfile`
3. **Dockerfile Path** : Laissez vide (si Root Directory = backend)
4. Le Dockerfile dans `backend/Dockerfile` sera utilisé automatiquement

### Option C : Vérifier les Fichiers

Assurez-vous que ces fichiers existent dans votre repository :

- ✅ `backend/package.json`
- ✅ `backend/prisma/schema.prisma`
- ✅ `backend/nixpacks.toml`
- ✅ `backend/railway.json`
- ✅ `backend/src/main.ts`

## 📝 Checklist Complète

- [ ] Root Directory = `backend` configuré
- [ ] Builder = Nixpacks (ou Dockerfile)
- [ ] Variables d'environnement configurées
- [ ] PostgreSQL ajouté comme service
- [ ] Service redéployé
- [ ] Logs vérifiés (pas d'erreur "cd backend")
- [ ] Build réussit
- [ ] API accessible

## 🎯 Résumé

**La clé du succès** : 
1. ✅ Configurer **Root Directory = `backend`** dans Settings → Source
2. ✅ Laisser Nixpacks détecter automatiquement `backend/nixpacks.toml`
3. ✅ Ne pas mettre de commande de build personnalisée avec `cd backend`

Railway utilisera alors directement `backend/` comme contexte et exécutera les commandes depuis là automatiquement.

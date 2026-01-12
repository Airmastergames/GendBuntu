# 🚂 Guide Railway - Build qui Fonctionne

## ⚠️ Configuration Requise AVANT le Build

### 1. Root Directory (OBLIGATOIRE)

**C'est la première chose à faire après avoir créé le service :**

1. Railway Dashboard → votre service
2. **Settings** (⚙️) → **Source**
3. **Root Directory** : `backend`
4. **Save**

**Sans cette étape, le build échouera toujours !**

### 2. Configuration Build

Dans **Settings** → **Build** :

- **Builder** : `Nixpacks` (recommandé) ou `Dockerfile`
- **Build Command** : Laissez **VIDE** (Nixpacks utilisera `nixpacks.toml`)
- **Start Command** : `npm run start:prod`

### 3. Variables d'Environnement

Dans **Settings** → **Variables** :

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=changez-moi-en-production-min-32-caracteres
JWT_REFRESH_SECRET=changez-moi-en-production-min-32-caracteres
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://votre-frontend.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/votre-webhook
BCRYPT_ROUNDS=10
```

## 🔨 Processus de Build

Avec Root Directory = `backend` configuré, Railway :

1. ✅ Détecte `backend/package.json`
2. ✅ Utilise `backend/nixpacks.toml` pour le build
3. ✅ Exécute :
   - `npm install`
   - `npx prisma generate`
   - `npm run build`
4. ✅ Démarre avec `npm run start:prod`

**Tout s'exécute depuis `backend/` automatiquement !**

## ✅ Vérification

### Logs de Build Réussis

Vous devriez voir dans les logs :

```
[info] Detecting Nixpacks
[info] Using Node.js 18
[info] Installing dependencies...
[info] Generating Prisma Client...
[info] Building application...
[info] Build completed successfully
[info] Starting server...
```

### Test de l'API

1. Ouvrez : `https://votre-app.railway.app/api`
2. Devrait retourner une réponse JSON
3. Swagger : `https://votre-app.railway.app/api/docs`

## 🐛 Dépannage

### Erreur "cd backend: No such file or directory"

**Solution** : Vérifiez que Root Directory = `backend` est bien configuré dans Settings → Source

### Erreur "Cannot find module"

**Solution** : Vérifiez que `npm install` s'est bien exécuté dans les logs

### Erreur Prisma

**Solution** : Vérifiez que `npx prisma generate` s'est bien exécuté dans les logs

### Build échoue sans raison

**Solution** :
1. Vérifiez les logs complets Railway
2. Vérifiez que tous les fichiers existent dans `backend/`
3. Essayez de supprimer et recréer le service

## 📁 Fichiers de Configuration

Tous ces fichiers doivent exister dans `backend/` :

- ✅ `package.json` - Dépendances et scripts
- ✅ `nixpacks.toml` - Configuration de build
- ✅ `railway.json` - Configuration Railway
- ✅ `Dockerfile` - Alternative Docker
- ✅ `prisma/schema.prisma` - Schéma de base de données
- ✅ `src/main.ts` - Point d'entrée

## 🎯 Résumé

**Pour que Railway build correctement :**

1. ✅ **Root Directory = `backend`** (Settings → Source)
2. ✅ **Builder = Nixpacks** (Settings → Build)
3. ✅ **Build Command = VIDE** (laissez Nixpacks faire)
4. ✅ **Variables d'environnement** configurées
5. ✅ **Redéployer**

C'est tout ! Railway fera le reste automatiquement.

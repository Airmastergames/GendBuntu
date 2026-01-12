# 🔧 Correction Railway - Commandes de Build

## Le Problème

Railway essaie d'exécuter :
```
cd backend && npm install && npx prisma generate && npm run build
```

Mais le contexte de build ne contient pas le répertoire `backend`.

## ✅ Solution Définitive

### Option 1 : Configurer Root Directory (RECOMMANDÉ)

**C'est la meilleure solution - à faire en premier :**

1. Dans Railway Dashboard → votre service backend
2. **Settings** (⚙️) → **Source**
3. **Root Directory** : `backend`
4. **Save**

Railway utilisera alors directement `backend/` comme racine et exécutera :
```
npm install && npx prisma generate && npm run build
```

Sans le `cd backend` !

### Option 2 : Modifier la Commande de Build dans Railway

Si vous ne pouvez pas configurer Root Directory :

1. Dans Railway → Settings → Build
2. **Build Command** : 
   ```
   npm install && npx prisma generate && npm run build
   ```
3. **Start Command** :
   ```
   npm run start:prod
   ```

**Mais attention** : Cette commande s'exécutera depuis la racine du repo, donc elle ne fonctionnera que si vous déplacez `package.json` à la racine OU si vous configurez Root Directory.

### Option 3 : Utiliser le Dockerfile

1. Dans Railway → Settings → Build
2. **Builder** : `Dockerfile`
3. **Dockerfile Path** : `backend/Dockerfile` (ou laissez vide si Root Directory = backend)

Le Dockerfile est déjà configuré correctement.

## 📋 Configuration Recommandée

**La configuration la plus simple et fiable :**

1. ✅ **Root Directory** = `backend` (dans Settings → Source)
2. ✅ Railway détectera automatiquement :
   - `backend/package.json`
   - `backend/nixpacks.toml`
   - `backend/railway.json`
3. ✅ Les commandes s'exécuteront automatiquement depuis `backend/`

## ✅ Vérification

Après configuration, les logs Railway devraient montrer :

```
✓ Installing dependencies
✓ Generating Prisma Client
✓ Building application
```

**Sans** l'erreur `cd backend: No such file or directory`.

## 🎯 Résumé

**La solution principale** : Configurez **Root Directory = `backend`** dans Railway Settings → Source.

Cela résout automatiquement le problème car Railway utilisera directement le dossier `backend` comme contexte de build, sans avoir besoin de `cd backend`.

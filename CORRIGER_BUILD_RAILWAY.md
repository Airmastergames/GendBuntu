# 🔧 Corriger la Commande de Build Railway

## Le Problème

Railway essaie d'exécuter :
```
cd backend && npm install && npx prisma generate && npm run build
```

Mais obtient l'erreur :
```
/bin/bash: line 1: cd: backend: No such file or directory
```

## ✅ Solution 1 : Configurer Root Directory (RECOMMANDÉ)

**C'est la solution la plus simple et la plus fiable :**

1. Railway Dashboard → votre service backend
2. **Settings** (⚙️) → **Source**
3. **Root Directory** : `backend`
4. **Save**

**Résultat** : Railway exécutera automatiquement :
```
npm install && npx prisma generate && npm run build
```

**Sans le `cd backend` !**

## ✅ Solution 2 : Modifier la Commande de Build dans Railway

Si vous ne pouvez pas configurer Root Directory :

1. Railway Dashboard → votre service backend
2. **Settings** (⚙️) → **Build**
3. Dans **Build Command**, remplacez :
   ```
   cd backend && npm install && npx prisma generate && npm run build
   ```
   Par :
   ```
   npm install && npx prisma generate && npm run build
   ```
4. **Save**

**⚠️ Attention** : Cette solution ne fonctionnera que si :
- Root Directory = `backend` est configuré, OU
- Vous avez déplacé `package.json` à la racine (non recommandé)

## ✅ Solution 3 : Utiliser Nixpacks (Automatique)

Si Root Directory = `backend` est configuré, Railway utilisera automatiquement `backend/nixpacks.toml` qui contient :

```toml
[phases.install]
cmds = [
  "npm install",
  "npx prisma generate"
]

[phases.build]
cmds = [
  "npm run build"
]
```

**Pas besoin de `cd backend` !**

## ✅ Solution 4 : Utiliser Dockerfile

1. Railway Dashboard → votre service backend
2. **Settings** (⚙️) → **Build**
3. **Builder** : `Dockerfile`
4. **Dockerfile Path** : `backend/Dockerfile` (ou laissez vide si Root Directory = backend)
5. **Save**

Le Dockerfile est déjà configuré correctement et ne contient pas de `cd backend`.

## 📋 Checklist

- [ ] Root Directory = `backend` configuré dans Settings → Source
- [ ] Build Command ne contient PAS `cd backend`
- [ ] Start Command = `npm run start:prod`
- [ ] Variables d'environnement configurées
- [ ] Service redéployé

## 🎯 Résumé

**La meilleure solution** : Configurez **Root Directory = `backend`** dans Railway Settings → Source.

Cela résout automatiquement le problème car :
- ✅ Railway utilisera `backend/` comme contexte de build
- ✅ Les commandes s'exécuteront depuis `backend/` automatiquement
- ✅ Plus besoin de `cd backend` dans les commandes
- ✅ `nixpacks.toml` et `railway.json` dans `backend/` seront détectés automatiquement

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que `backend/package.json` existe dans votre repository
2. Vérifiez que `backend/prisma/schema.prisma` existe
3. Vérifiez les logs Railway complets
4. Essayez de supprimer et recréer le service Railway
5. Assurez-vous que Root Directory = `backend` est bien configuré

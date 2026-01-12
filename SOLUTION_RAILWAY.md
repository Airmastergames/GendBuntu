# 🚀 Solution Rapide pour Railway

## Le Problème

```
ERROR: cd backend: No such file or directory
```

Railway essaie d'exécuter `cd backend` mais le contexte de build ne contient pas ce répertoire.

## ✅ Solution en 3 Étapes (2 minutes)

### Étape 1 : Configurer le Root Directory

1. Ouvrez Railway Dashboard
2. Sélectionnez votre service backend
3. Allez dans **Settings** → **Source**
4. Dans **Root Directory**, entrez : `backend`
5. Cliquez sur **Save**

### Étape 2 : Vérifier la Configuration

Railway devrait maintenant :
- Détecter automatiquement `backend/package.json`
- Utiliser `backend/nixpacks.toml` (si présent)
- Exécuter les commandes depuis `backend/`

### Étape 3 : Redéployer

1. Allez dans **Deployments**
2. Cliquez sur **Redeploy** ou poussez un nouveau commit

## ✅ C'est tout !

Railway utilisera maintenant directement le dossier `backend` comme racine. Plus besoin de `cd backend` dans les commandes.

## Vérification

Après le déploiement, vérifiez que :
- ✅ Le build réussit
- ✅ L'API répond : `https://your-app.railway.app/api`
- ✅ Swagger fonctionne : `https://your-app.railway.app/api/docs`

## Si ça ne fonctionne pas

1. Vérifiez que le dossier `backend/` existe dans votre repository
2. Vérifiez que `backend/package.json` existe
3. Vérifiez les logs Railway pour plus de détails
4. Essayez de supprimer et recréer le service Railway

## Alternative : Dockerfile

Si le Root Directory ne fonctionne pas, vous pouvez utiliser le Dockerfile :

1. Dans Railway → Settings → Build
2. Builder : **Dockerfile**
3. Dockerfile Path : `backend/Dockerfile`

Le Dockerfile est déjà créé dans `backend/Dockerfile`.

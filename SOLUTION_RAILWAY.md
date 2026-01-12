# 🚀 Solution Rapide pour Railway

## ⚠️ Le Problème

```
/bin/bash: line 1: cd: backend: No such file or directory
```

Railway essaie d'exécuter `cd backend` mais le contexte de build ne contient pas ce répertoire.

## ✅ Solution en 1 Étape (30 secondes) - LA PLUS IMPORTANTE

### ⭐ ÉTAPE UNIQUE : Configurer le Root Directory

**C'EST LA SOLUTION PRINCIPALE - FAITES CECI EN PREMIER !**

1. Ouvrez **Railway Dashboard** → votre service backend
2. Cliquez sur **Settings** (⚙️ icône en haut à droite)
3. Dans le menu de gauche, cliquez sur **Source**
4. Dans le champ **Root Directory**, entrez exactement : `backend`
5. Cliquez sur **Save** (en bas)

**C'est tout !** Railway utilisera maintenant directement le dossier `backend` comme racine.

### Redéployer

1. Allez dans **Deployments**
2. Cliquez sur **Redeploy** ou poussez un nouveau commit sur GitHub

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

# Guide de Démarrage Rapide - GendBuntu

## 🚀 Démarrage Local

### Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Git

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd Redengine
```

### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Générer le client Prisma
npx prisma generate

# Créer la base de données et exécuter les migrations
npx prisma migrate dev

# Seed la base de données (optionnel)
npm run prisma:seed

# Démarrer le serveur
npm run start:dev
```

Le backend sera accessible sur `http://localhost:3001`
Documentation API : `http://localhost:3001/api/docs`

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'environnement
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 🔐 Comptes de Test

Après avoir exécuté le seed, vous pouvez vous connecter avec :

- **Admin**: `admin@gendbuntu.fr` / `password123`
- **Gendarme**: `gendarme@gendbuntu.fr` / `password123`
- **OPJ**: `opj@gendbuntu.fr` / `password123`
- **CORG**: `corg@gendbuntu.fr` / `password123`

## 📁 Structure du Projet

```
Redengine/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/        # Authentification
│   │   ├── pulsar/      # Module Pulsar
│   │   ├── lrpgn/       # Module LRPGN
│   │   ├── messagerie/  # Messagerie
│   │   ├── annuaire/    # Annuaire
│   │   ├── bdsp/        # BDSP
│   │   ├── compte-rendu/# Compte-rendu
│   │   ├── eventgrave/  # EventGrave
│   │   └── admin/       # Administration
│   └── prisma/          # Schéma DB
├── frontend/            # Application Next.js
│   ├── app/             # Pages et routes
│   ├── components/      # Composants React
│   └── lib/             # Utilitaires
└── README.md
```

## 🛠️ Commandes Utiles

### Backend

```bash
# Développement
npm run start:dev

# Production
npm run build
npm run start:prod

# Prisma
npx prisma studio          # Interface graphique DB
npx prisma migrate dev     # Créer une migration
npx prisma generate        # Régénérer le client
npm run prisma:seed        # Seed la DB
```

### Frontend

```bash
# Développement
npm run dev

# Production
npm run build
npm run start

# Lint
npm run lint
```

## 📚 Documentation

- **Architecture**: Voir `ARCHITECTURE.md`
- **Déploiement**: Voir `DEPLOYMENT.md`
- **API**: `http://localhost:3001/api/docs` (Swagger)

## 🐛 Dépannage

### Erreur de connexion à la base de données

Vérifier que PostgreSQL est démarré et que `DATABASE_URL` dans `.env` est correct.

### Erreur Prisma

```bash
# Nettoyer et régénérer
rm -rf node_modules/.prisma
npx prisma generate
```

### Port déjà utilisé

Changer le port dans `.env` (backend) ou `next.config.js` (frontend).

## 📝 Prochaines Étapes

1. Configurer votre base de données PostgreSQL
2. Exécuter les migrations Prisma
3. Seed la base de données
4. Démarrer backend et frontend
5. Se connecter avec un compte de test
6. Explorer les différents modules

## 🆘 Support

En cas de problème, vérifier :
1. Les logs du backend (console)
2. Les logs du frontend (console navigateur)
3. La documentation API (Swagger)
4. Les fichiers de configuration

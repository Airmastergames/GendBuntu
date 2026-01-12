# Architecture GendBuntu

## Vue d'ensemble

GendBuntu est une application web full-stack modulaire pour la gestion complète de la Gendarmerie Nationale.

## Stack Technique

### Backend
- **Framework**: NestJS (Node.js)
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **Authentification**: JWT + Refresh Token
- **Documentation**: Swagger/OpenAPI
- **Déploiement**: Railway

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Déploiement**: Vercel

## Architecture Modulaire

### Modules Backend

1. **Auth** - Authentification et autorisation
2. **Users** - Gestion des utilisateurs
3. **Unites** - Gestion des unités
4. **Pulsar** - Planning et services
5. **LRPGN** - Outils OPJ (PVE, PV)
6. **Messagerie** - Messagerie interne
7. **Annuaire** - Annuaire des personnels
8. **BDSP** - Gestion des interventions
9. **CompteRendu** - Comptes-rendus opérationnels
10. **EventGrave** - Incidents graves
11. **Admin** - Administration
12. **Audit** - Logs et audit

### Modules Frontend

Chaque module backend correspond à une route frontend :
- `/dashboard` - Tableau de bord
- `/pulsar` - Planning et services
- `/lrpgn` - Outils OPJ
- `/messagerie` - Messagerie
- `/annuaire` - Annuaire
- `/bdsp` - Interventions
- `/compte-rendu` - Comptes-rendus
- `/eventgrave` - Incidents
- `/admin` - Administration

## Base de Données

### Modèles Principaux

- **User** - Utilisateurs avec rôles et permissions
- **Unite** - Unités de la gendarmerie
- **PlanningService** - Services et plannings
- **PV** - Procès-verbaux
- **PVE** - Procès-verbaux électroniques
- **Message** - Messages internes
- **Intervention** - Interventions BDSP
- **CompteRendu** - Comptes-rendus
- **Incident** - Incidents graves
- **AuditLog** - Logs d'audit

### Relations

- User ↔ Unite (Many-to-One)
- User ↔ PlanningService (Many-to-Many via PlanningParticipant)
- PV ↔ PlanningService (Many-to-One)
- PV ↔ PVE (One-to-One)
- Intervention ↔ Unite (Many-to-One)
- Intervention ↔ User (Many-to-One)
- Incident ↔ Intervention (Many-to-One)

## Sécurité

### Authentification
- JWT avec expiration courte (15 min)
- Refresh Token avec expiration longue (7 jours)
- Hashage bcrypt des mots de passe
- Protection CSRF via CORS configuré

### Autorisation
- Rôles : ADMIN, CORG, OPJ, GENDARME, OFFICIER, COMMANDEMENT
- Guards NestJS pour protection des routes
- Décorateurs `@Roles()` pour contrôle d'accès

### Audit
- Logs de toutes les actions importantes
- Traçabilité complète des modifications
- Historique des connexions

## API REST

### Endpoints Principaux

#### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription (Admin)
- `POST /api/auth/refresh` - Rafraîchir token
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

#### Pulsar
- `GET /api/pulsar/planning` - Liste des plannings
- `POST /api/pulsar/planning` - Créer un planning
- `GET /api/pulsar/pv` - Liste des PV
- `POST /api/pulsar/pv` - Créer un PV

#### BDSP
- `GET /api/bdsp/interventions` - Liste des interventions
- `POST /api/bdsp/interventions` - Créer une intervention
- `PATCH /api/bdsp/interventions/:id/assign` - Assigner une intervention

#### Compte-rendu
- `POST /api/compte-rendu` - Créer un compte-rendu (génère PDF + upload Discord)
- `GET /api/compte-rendu/:id/pdf` - Télécharger le PDF

## Design System

### Couleurs (Thème Militaire Sombre)

- **Primary**: Gris bleuté (#627d98)
- **Accent**: Orange militaire (#ff9800)
- **Background**: Sombre (#102a43)
- **Card**: Card sombre (#243b53)
- **Danger**: Rouge (#f44336)
- **Success**: Vert (#4caf50)

### Typographie

- **Sans-serif**: Inter
- **Monospace**: JetBrains Mono

## Déploiement

### Backend (Railway)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Railway détecte automatiquement NestJS
4. Base de données PostgreSQL provisionnée automatiquement

### Frontend (Vercel)

1. Connecter le repository GitHub
2. Configurer `NEXT_PUBLIC_API_URL` avec l'URL Railway
3. Déploiement automatique à chaque push

## Variables d'Environnement

### Backend (.env)

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3001
FRONTEND_URL=https://your-app.vercel.app
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
BCRYPT_ROUNDS=10
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

## Développement Local

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Prochaines Étapes

1. Implémenter les interfaces complètes de chaque module
2. Ajouter les tests unitaires et E2E
3. Optimiser les performances
4. Ajouter la gestion des fichiers (upload)
5. Implémenter les notifications en temps réel (WebSocket)
6. Ajouter l'export Excel/CSV
7. Dashboard avec graphiques et statistiques

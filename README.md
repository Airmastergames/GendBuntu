# GendBuntu - Système de Gestion Gendarmerie Nationale

Application web complète de gestion pour la Gendarmerie Nationale, reproduisant l'interface et l'ergonomie de GendBuntu.

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: NestJS + TypeScript + Prisma
- **Base de données**: PostgreSQL
- **Authentification**: JWT + Refresh Token
- **Déploiement**: Vercel (Frontend) + Railway (Backend + DB)

## 📦 Modules

1. **Pulsar** - Gestion des emplois du temps et du service
2. **LRPGN** - Outils OPJ (PVE, PV)
3. **Messagerie** - Système de messagerie interne
4. **Annuaire** - Annuaire interne des personnels
5. **BDSP** - Gestion des interventions (CORG)
6. **Compte-rendu** - Application de compte-rendu opérationnel
7. **EventGrave** - Gestion des incidents graves
8. **Administration** - Panneau d'administration

## 🚀 Démarrage

### Prérequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Installation

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev

# Frontend
cd frontend
npm install
```

### Développement

```bash
# Backend (port 3001)
cd backend
npm run start:dev

# Frontend (port 3000)
cd frontend
npm run dev
```

## 🔐 Rôles et Permissions

- **Admin**: Accès complet
- **CORG**: Gestion des interventions
- **OPJ**: Outils OPJ, PV, PVE
- **Gendarme**: Consultation, compte-rendus
- **Officier**: Supervision, validation
- **Commandement**: Accès stratégique

## 📄 Licence

Usage interne - Gendarmerie Nationale

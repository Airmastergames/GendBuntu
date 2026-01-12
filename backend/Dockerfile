# Dockerfile pour Railway - Backend GendBuntu
# Ce Dockerfile est dans backend/ et Railway doit avoir Root Directory = 'backend'

FROM node:18-alpine AS base

# Installer les dépendances système nécessaires pour Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer toutes les dépendances (y compris devDependencies pour le build)
RUN npm install && npm cache clean --force

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code
COPY . .

# Build de l'application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Installer les dépendances système
RUN apk add --no-cache libc6-compat openssl

# Installer uniquement les dépendances de production
COPY --from=base /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier les fichiers nécessaires depuis le stage de build
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
RUN npx prisma generate

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

# Commande de démarrage
CMD ["npm", "run", "start:prod"]

import { PrismaClient, Role, Grade } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // Création d'une unité
  const unite = await prisma.unite.upsert({
    where: { code: 'BRIG-001' },
    update: {},
    create: {
      code: 'BRIG-001',
      nom: 'Brigade de Test',
      type: 'Brigade Territoriale',
      adresse: '123 Rue de la République',
      telephone: '01 23 45 67 89',
      email: 'brigade001@gendarmerie.fr',
    },
  });

  console.log('✅ Unité créée:', unite.nom);

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Création d'un admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gendbuntu.fr' },
    update: {},
    create: {
      rio: 'ADMIN001',
      nom: 'Admin',
      prenom: 'Système',
      email: 'admin@gendbuntu.fr',
      password: hashedPassword,
      grade: Grade.CAPITAINE,
      numeroService: 'NS-ADMIN-001',
      uniteId: unite.id,
      role: Role.ADMIN,
    },
  });

  console.log('✅ Admin créé:', admin.email);

  // Création d'un gendarme
  const gendarme = await prisma.user.upsert({
    where: { email: 'gendarme@gendbuntu.fr' },
    update: {},
    create: {
      rio: 'GEND001',
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'gendarme@gendbuntu.fr',
      password: hashedPassword,
      grade: Grade.GENDARME,
      numeroService: 'NS-GEND-001',
      uniteId: unite.id,
      role: Role.GENDARME,
    },
  });

  console.log('✅ Gendarme créé:', gendarme.email);

  // Création d'un OPJ
  const opj = await prisma.user.upsert({
    where: { email: 'opj@gendbuntu.fr' },
    update: {},
    create: {
      rio: 'OPJ001',
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'opj@gendbuntu.fr',
      password: hashedPassword,
      grade: Grade.ADJUDANT,
      numeroService: 'NS-OPJ-001',
      uniteId: unite.id,
      role: Role.OPJ,
    },
  });

  console.log('✅ OPJ créé:', opj.email);

  // Création d'un CORG
  const corg = await prisma.user.upsert({
    where: { email: 'corg@gendbuntu.fr' },
    update: {},
    create: {
      rio: 'CORG001',
      nom: 'Bernard',
      prenom: 'Marie',
      email: 'corg@gendbuntu.fr',
      password: hashedPassword,
      grade: Grade.LIEUTENANT,
      numeroService: 'NS-CORG-001',
      uniteId: unite.id,
      role: Role.CORG,
    },
  });

  console.log('✅ CORG créé:', corg.email);

  console.log('🎉 Seed terminé avec succès!');
  console.log('\n📝 Comptes de test créés:');
  console.log('   Admin: admin@gendbuntu.fr / password123');
  console.log('   Gendarme: gendarme@gendbuntu.fr / password123');
  console.log('   OPJ: opj@gendbuntu.fr / password123');
  console.log('   CORG: corg@gendbuntu.fr / password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

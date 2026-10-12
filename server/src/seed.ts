// Données initiales de la base, lancées après les migrations (`task db:migrate`)
// ou seules (`task db:seed`). Relançable : rien n'est dupliqué.
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';
import { Role } from './entities/role.js';
import { hashPassword } from './auth/password.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/**
 * Compte administrateur défini par ADMIN_EMAIL et ADMIN_PASSWORD. Créé s'il
 * n'existe pas ; s'il existe, seul son rôle est remis à admin (le mot de
 * passe n'est pas écrasé).
 */
async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('ADMIN_EMAIL ou ADMIN_PASSWORD vide : pas de compte admin.');
    return;
  }
  await prisma.user.upsert({
    where: { email },
    update: { role: Role.admin },
    create: {
      email,
      displayName: 'Admin',
      passwordHash: await hashPassword(password),
      role: Role.admin,
    },
  });
  console.log(`Compte admin : ${email}`);
}

try {
  await seedAdmin();
} finally {
  await prisma.$disconnect();
}

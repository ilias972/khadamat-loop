import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  if (!email) {
    throw new Error('SEED_ADMIN_EMAIL is required');
  }
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) { console.log('Admin already exists'); return; }
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password) {
    throw new Error('SEED_ADMIN_PASSWORD is required');
  }
  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      firstName: process.env.SEED_ADMIN_FIRSTNAME || 'Admin',
      lastName: process.env.SEED_ADMIN_LASTNAME || 'Root',
      role: 'ADMIN',
      isVerified: true
    }
  });
  console.log('Admin created:', user.email);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());

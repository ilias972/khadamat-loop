import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
const prisma = new PrismaClient();

async function upsertAdmin(email:string, pass:string, firstName:string) {
  const hashed = await hashPassword(pass);
  const found = await prisma.user.findUnique({ where: { email }});
  if (!found) {
    await prisma.user.create({ data: { email, password: hashed, firstName, lastName:'Admin', role:'ADMIN', isVerified:true }});
  } else if (found.role !== 'ADMIN') {
    await prisma.user.update({ where:{ id:found.id }, data:{ role:'ADMIN', isVerified:true }});
  }
}

(async ()=>{
  await upsertAdmin('adminA@khadamat.test','ChangeMe_1!','AdminA');
  await upsertAdmin('adminB@khadamat.test','ChangeMe_1!','AdminB');
  console.log('Admins A & B OK');
  process.exit(0);
})().catch(e=>{ console.error(e); process.exit(1); });

import '../test/env';
import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

describe('Auth flow', () => {
  it('login -> refresh -> logout', async () => {
    const email = `t${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;
    await request(app).post('/api/auth/register').send({ email, password: 'Passw0rd!', role: 'CLIENT' }).expect(201);
    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
    const cookie = loginRes.headers['set-cookie'][0].split(';')[0];
    const refreshRes = await request(app).post('/api/auth/refresh').set('Cookie', cookie).send({}).expect(200);
    const newCookie = refreshRes.headers['set-cookie'][0].split(';')[0];
    await request(app).post('/api/auth/logout').set('Cookie', newCookie).send({}).expect(200);
  });

  it('change password works', async () => {
    const email = `c${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;
    await request(app).post('/api/auth/register').send({ email, password: 'Passw0rd!', role: 'CLIENT' }).expect(201);
    const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'Passw0rd!' }).expect(200);
    const token = loginRes.body.data.accessToken;
    await request(app)
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ oldPassword: 'Passw0rd!', newPassword: 'N3wPassw0rd!' })
      .expect(200);
    await request(app).post('/api/auth/login').send({ email, password: 'N3wPassw0rd!' }).expect(200);
  });

  it('reset password confirm works', async () => {
    const email = `r${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;
    await request(app).post('/api/auth/register').send({ email, password: 'Passw0rd!', role: 'CLIENT' }).expect(201);
    await request(app).post('/api/auth/reset-password').send({ email }).expect(200);
    const user = await prisma.user.findUnique({ where: { email } });
    const raw = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(raw + (process.env.RESET_TOKEN_PEPPER || '')).digest('hex');
    await prisma.passwordResetToken.create({ data: { userId: user!.id, tokenHash, expiresAt: new Date(Date.now() + 3600000) } });
    await request(app).post('/api/auth/reset-password/confirm').send({ token: raw, newPassword: 'NewPass123!' }).expect(200);
    await request(app).post('/api/auth/login').send({ email, password: 'NewPass123!' }).expect(200);
  });
});

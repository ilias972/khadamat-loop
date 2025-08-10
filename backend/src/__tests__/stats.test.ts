import '../test/env';
import request from 'supertest';
import { app } from '../server';

describe('stats admin', () => {
  it('allows admin only', async () => {
    const adminEmail = `a${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;
    const userEmail = `u${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;

    await request(app).post('/api/auth/register').send({ email: adminEmail, password: 'Passw0rd!', role: 'ADMIN' }).expect(201);
    await request(app).post('/api/auth/register').send({ email: userEmail, password: 'Passw0rd!', role: 'CLIENT' }).expect(201);

    const adminLogin = await request(app).post('/api/auth/login').send({ email: adminEmail, password: 'Passw0rd!' }).expect(200);
    const userLogin = await request(app).post('/api/auth/login').send({ email: userEmail, password: 'Passw0rd!' }).expect(200);

    const adminToken = adminLogin.body.data.accessToken;
    const userToken = userLogin.body.data.accessToken;

    await request(app)
      .get('/api/stats/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    await request(app)
      .get('/api/stats/admin')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });
});

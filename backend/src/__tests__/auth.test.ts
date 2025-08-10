import '../test/env';
import request from 'supertest';
import { app } from '../server';

describe('Auth', () => {
  it('register + login + profile', async () => {
    const email = `t${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;
    await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Passw0rd!', role: 'CLIENT' })
      .expect(201);
    const { body } = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'Passw0rd!' })
      .expect(200);
    const token = body?.data?.accessToken;
    expect(token).toBeDefined();
    await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});

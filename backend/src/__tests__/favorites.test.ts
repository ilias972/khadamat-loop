import '../test/env';
import request from 'supertest';
import { app } from '../server';

describe('favorites flow', () => {
  it('add/check/idempotent/delete', async () => {
    const pEmail = `p${Date.now()}@test.io`;
    const cEmail = `c${Date.now()}@test.io`;

    await request(app).post('/api/auth/register').send({ email: pEmail, password: 'Passw0rd!', role: 'PROVIDER' }).expect(201);
    await request(app).post('/api/auth/register').send({ email: cEmail, password: 'Passw0rd!', role: 'CLIENT' }).expect(201);

    const pLogin = await request(app).post('/api/auth/login').send({ email: pEmail, password: 'Passw0rd!' }).expect(200);
    const cLogin = await request(app).post('/api/auth/login').send({ email: cEmail, password: 'Passw0rd!' }).expect(200);
    const pToken = pLogin.body.data.accessToken;
    const cToken = cLogin.body.data.accessToken;

    await request(app).post('/api/providers').set('Authorization', `Bearer ${pToken}`).send({ bio: 'pro' }).expect(201);

    // add favorite
    await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${cToken}`)
      .send({ providerId: pLogin.body.data.user.id })
      .expect(201);

    const check = await request(app)
      .get(`/api/favorites/check/${pLogin.body.data.user.id}`)
      .set('Authorization', `Bearer ${cToken}`)
      .expect(200);
    expect(check.body.data.isFavorite).toBe(true);

    // idempotent add
    await request(app)
      .post('/api/favorites')
      .set('Authorization', `Bearer ${cToken}`)
      .send({ providerId: pLogin.body.data.user.id })
      .expect(200);

    const list = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${cToken}`)
      .expect(200);
    expect(list.body.data.items).toHaveLength(1);

    await request(app)
      .delete(`/api/favorites/${pLogin.body.data.user.id}`)
      .set('Authorization', `Bearer ${cToken}`)
      .expect(200);

    const check2 = await request(app)
      .get(`/api/favorites/check/${pLogin.body.data.user.id}`)
      .set('Authorization', `Bearer ${cToken}`)
      .expect(200);
    expect(check2.body.data.isFavorite).toBe(false);
  });
});

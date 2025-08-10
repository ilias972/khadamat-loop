import '../test/env';
import request from 'supertest';
import { app } from '../server';

describe('messages flow', () => {
  it('send, list, mark read, ownership', async () => {
    const aEmail = `a${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;
    const bEmail = `b${Date.now()}_${Math.random().toString(36).slice(2)}@test.io`;

    await request(app).post('/api/auth/register').send({ email: aEmail, password: 'Passw0rd!', role: 'CLIENT' }).expect(201);
    await request(app).post('/api/auth/register').send({ email: bEmail, password: 'Passw0rd!', role: 'PROVIDER' }).expect(201);

    const aLogin = await request(app).post('/api/auth/login').send({ email: aEmail, password: 'Passw0rd!' }).expect(200);
    const bLogin = await request(app).post('/api/auth/login').send({ email: bEmail, password: 'Passw0rd!' }).expect(200);
    const aToken = aLogin.body.data.accessToken;
    const bToken = bLogin.body.data.accessToken;

    const msg = await request(app)
      .post('/api/messages')
      .set('Authorization', `Bearer ${aToken}`)
      .send({ receiverId: bLogin.body.data.user.id, content: 'hello' })
      .expect(201);
    const messageId = msg.body.data.message.id;

    const unread = await request(app)
      .get('/api/messages/unread-count')
      .set('Authorization', `Bearer ${bToken}`)
      .expect(200);
    expect(unread.body.data.unreadTotal).toBe(1);

    const conv = await request(app)
      .get(`/api/messages/conversation/${aLogin.body.data.user.id}?markAsRead=true`)
      .set('Authorization', `Bearer ${bToken}`)
      .expect(200);
    expect(conv.body.data.items).toHaveLength(1);

    const unread2 = await request(app)
      .get('/api/messages/unread-count')
      .set('Authorization', `Bearer ${bToken}`)
      .expect(200);
    expect(unread2.body.data.unreadTotal).toBe(0);

    await request(app)
      .put(`/api/messages/${messageId}/read`)
      .set('Authorization', `Bearer ${aToken}`)
      .expect(403);
  });
});

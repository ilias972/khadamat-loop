import '../test/env';
import request from 'supertest';
import { app } from '../server';

function dayPlus(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

describe('Booking flow', () => {
  it('client create pending -> provider confirm', async () => {
    const pEmail = `p${Date.now()}@test.io`;
    const cEmail = `c${Date.now()}@test.io`;

    await request(app)
      .post('/api/auth/register')
      .send({ email: pEmail, password: 'Passw0rd!', role: 'PROVIDER' })
      .expect(201);
    await request(app)
      .post('/api/auth/register')
      .send({ email: cEmail, password: 'Passw0rd!', role: 'CLIENT' })
      .expect(201);

    const pLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: pEmail, password: 'Passw0rd!' })
      .expect(200);
    const cLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: cEmail, password: 'Passw0rd!' })
      .expect(200);

    const pToken = pLogin.body.data.accessToken;
    const cToken = cLogin.body.data.accessToken;

    await request(app)
      .post('/api/providers')
      .set('Authorization', `Bearer ${pToken}`)
      .send({ bio: 'pro' })
      .expect(201);
    const svc = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${pToken}`)
      .send({ name: 'Plomberie', category: 'plumbing', basePrice: 1000, description: 'fix' })
      .expect(201);
    const serviceId = svc.body.data.service.id;

    const b1 = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${cToken}`)
      .send({ serviceId, title: 'Fix', description: 'Robinet qui fuit', scheduledDay: dayPlus(2) })
      .expect(201);
    const bookingId = b1.body.data.booking.id;

    await request(app)
      .put(`/api/bookings/${bookingId}/confirm`)
      .set('Authorization', `Bearer ${pToken}`)
      .expect(200);
  });
});

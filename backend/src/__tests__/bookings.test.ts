import request from 'supertest';
import { app } from '../server';

describe('bookings flow', () => {
  it('placeholder', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });
});

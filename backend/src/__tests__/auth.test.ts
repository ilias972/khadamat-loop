import request from 'supertest';
import { app } from '../server';

describe('auth flow', () => {
  it('placeholder', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });
});

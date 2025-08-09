import request from 'supertest';
import { app } from '../server';

describe('messages flow', () => {
  it('placeholder', async () => {
    const res = await request(app).get('/health');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });
});

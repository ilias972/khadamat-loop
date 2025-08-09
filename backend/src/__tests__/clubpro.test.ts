import request from 'supertest';
import { app } from '../server';

describe('clubpro flow', () => {
  it('placeholder', async () => {
    const res = await request(app).get('/health');
    expect(res.body.version).toBeDefined();
  });
});

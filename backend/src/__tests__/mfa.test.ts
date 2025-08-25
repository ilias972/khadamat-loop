import '../test/env';
import request from 'supertest';
import { app } from '../app';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password';
import { generateSecret, generateTotp } from '../utils/totp';
import { encryptWithActiveKey } from '../config/keyring';

const prisma = new PrismaClient();

describe('MFA', () => {
  it('admin login requires mfa and verification works', async () => {
    process.env.STAGE = 'prod';
    process.env.MFA_ENFORCE_ROLES = 'ADMIN';

    const email = `admin_${Date.now()}@test.io`;
    const password = 'Passw0rd!';
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, password: hashed, role: 'ADMIN', isVerified: true } });

    const secret = generateSecret();
    const enc = encryptWithActiveKey(secret);
    await prisma.mfaSecret.create({
      data: {
        userId: user.id,
        encSecret: enc.encDoc,
        encTag: enc.encDocTag,
        encNonce: enc.encDocNonce,
        keyId: enc.keyId,
        enabledAt: new Date(),
        recoveryCodes: '[]',
      },
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);
    expect(loginRes.body.data.mfaRequired).toBe(true);
    const pending = loginRes.body.data.pendingToken as string;
    expect(pending).toBeTruthy();

    const code = generateTotp(secret);

    const verifyRes = await request(app)
      .post('/api/auth/mfa/verify')
      .set('Authorization', `Bearer ${pending}`)
      .send({ code })
      .expect(200);
    const accessToken = verifyRes.body.data.accessToken;
    expect(accessToken).toBeTruthy();

    await request(app)
      .get('/api/stats/admin')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });
});

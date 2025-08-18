import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
import { generateSecret, otpauthURL } from '../src/utils/totp';
import { encryptWithActiveKey } from '../src/config/keyring';

import './demo-guard.js';

const prisma = new PrismaClient();

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function maybePrintQr(otpauth: string) {
  try {
    const qrcode = await import('qrcode-terminal');
    qrcode.generate(otpauth, { small: true });
  } catch {
    console.log('Install qrcode-terminal for QR output');
  }
}

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const clientEmail = process.env.DEMO_CLIENT_EMAIL;
  const clientPassword = process.env.DEMO_CLIENT_PASSWORD;
  const providerEmail = process.env.DEMO_PROVIDER_EMAIL;
  const providerPassword = process.env.DEMO_PROVIDER_PASSWORD;
  if (!adminEmail || !adminPassword || !clientEmail || !clientPassword || !providerEmail || !providerPassword) {
    throw new Error('Missing required env vars for demo provisioning');
  }

  const hashedAdmin = await hashPassword(adminPassword);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedAdmin, role: 'ADMIN', isDemo: true, isDisabled: false },
    create: { email: adminEmail, password: hashedAdmin, role: 'ADMIN', isDemo: true, isDisabled: false, isVerified: true }
  });

  if (process.env.SEED_ADMIN_MFA_SETUP === 'true') {
    const secret = generateSecret();
    const uri = otpauthURL(admin.email, secret);
    const enc = encryptWithActiveKey(secret);
    await prisma.mfaSecret.upsert({
      where: { userId: admin.id },
      update: { encSecret: enc.encDoc, encTag: enc.encDocTag, encNonce: enc.encDocNonce, keyId: enc.keyId },
      create: { userId: admin.id, encSecret: enc.encDoc, encTag: enc.encDocTag, encNonce: enc.encDocNonce, keyId: enc.keyId }
    });
    console.log('Admin MFA otpauth URL:', uri);
    await maybePrintQr(uri);
  }

  const hashedClient = await hashPassword(clientPassword);
  const client = await prisma.user.upsert({
    where: { email: clientEmail },
    update: { password: hashedClient, role: 'CLIENT', isDemo: true, isVerified: true },
    create: { email: clientEmail, password: hashedClient, role: 'CLIENT', isDemo: true, isVerified: true }
  });

  const hashedProvider = await hashPassword(providerPassword);
  const providerUser = await prisma.user.upsert({
    where: { email: providerEmail },
    update: { password: hashedProvider, role: 'PROVIDER', isDemo: true, isVerified: true },
    create: { email: providerEmail, password: hashedProvider, role: 'PROVIDER', isDemo: true, isVerified: true }
  });

  const displayName = process.env.DEMO_PROVIDER_DISPLAY_NAME || 'Prestataire Démo';
  const cityName = process.env.DEMO_PROVIDER_CITY || 'Casablanca';
  const lat = parseFloat(process.env.DEMO_PROVIDER_LAT || '0');
  const lng = parseFloat(process.env.DEMO_PROVIDER_LNG || '0');
  const citySlug = slugify(cityName);

  const city = await prisma.city.upsert({
    where: { slug: citySlug },
    update: { name: cityName, lat, lng },
    create: { name: cityName, slug: citySlug, lat, lng }
  });

  const provider = await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: { displayName, cityId: city.id, lat, lng },
    create: { userId: providerUser.id, displayName, cityId: city.id, lat, lng }
  });

  const serviceSlug = process.env.DEMO_PROVIDER_SERVICE_SLUG || 'plomberie';
  let serviceName = serviceSlug;
  try {
    const { serviceCatalog } = await import('../../server/serviceCatalog');
    const item = serviceCatalog.find((s: any) => s.slug === serviceSlug);
    if (item) serviceName = item.name_fr;
  } catch {}
  const existingService = await prisma.service.findFirst({ where: { providerId: provider.id, category: serviceSlug } });
  if (existingService) {
    await prisma.service.update({ where: { id: existingService.id }, data: { name: serviceName, category: serviceSlug } });
  } else {
    await prisma.service.create({ data: { providerId: provider.id, name: serviceName, category: serviceSlug } });
  }

  if (process.env.DEMO_MARK_PROVIDER_KYC_VERIFIED === 'true') {
    await prisma.verification.upsert({
      where: { externalId: 'demo-provider' },
      update: { userId: providerUser.id, status: 'VERIFIED', verifiedAt: new Date(), provider: 'demo' },
      create: { userId: providerUser.id, externalId: 'demo-provider', provider: 'demo', status: 'VERIFIED', verifiedAt: new Date() }
    });
  }

  console.log(JSON.stringify({
    admin: { id: admin.id, email: admin.email, role: admin.role },
    client: { id: client.id, email: client.email, role: client.role },
    provider: { id: providerUser.id, email: providerUser.email, role: providerUser.role }
  }, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());

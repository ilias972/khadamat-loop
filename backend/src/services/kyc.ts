let stripe: any = null;
try {
  if (process.env.KYC_PROVIDER === 'stripe' && process.env.STRIPE_SECRET_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  }
} catch {
  stripe = null;
}

export async function createKycSessionFor(userId: number) {
  if (!stripe) throw new Error('KYC provider not configured');
  return stripe.identity.verificationSessions.create({
    type: 'document',
    options: { document: { require_matching_selfie: true } },
    metadata: { userId: String(userId) }
  });
}

export async function retrieveKycSession(id: string) {
  if (!stripe) throw new Error('KYC provider not configured');
  return stripe.identity.verificationSessions.retrieve(id);
}

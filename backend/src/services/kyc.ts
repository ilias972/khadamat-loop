import Stripe from 'stripe';
const stripe = process.env.KYC_PROVIDER==='stripe' && process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' }) : null;

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

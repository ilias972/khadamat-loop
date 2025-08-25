let stripe: any = null;
if (process.env.KYC_PROVIDER === 'stripe' && process.env.STRIPE_SECRET_KEY) {
  import('stripe')
    .then(({ default: Stripe }) => {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });
    })
    .catch(() => {
      stripe = null;
    });
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

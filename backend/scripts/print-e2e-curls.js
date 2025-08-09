const base = 'http://localhost:3000';
const email = 'provider@example.com';
const password = 'Password123';

console.log('# Register provider');
console.log(`curl -X POST ${base}/api/auth/register \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"${email}","password":"${password}","role":"PROVIDER"}'\n`);

console.log('# Login and capture token');
console.log(`TOKEN=$(curl -s -X POST ${base}/api/auth/login \\
  -H 'Content-Type: application/json' \\
  -d '{"email":"${email}","password":"${password}"}' | jq -r '.data.accessToken')\n`);

console.log('# Create pending subscription');
console.log(`curl -X POST ${base}/api/subscriptions/club-pro \\
  -H "Authorization: Bearer $TOKEN"\n`);

console.log('# Create checkout session');
console.log(`curl -X POST ${base}/api/payments/club-pro \\
  -H "Authorization: Bearer $TOKEN"\n`);

console.log('# Stripe webhook listener');
console.log('stripe listen --forward-to http://localhost:3000/api/payments/webhook');


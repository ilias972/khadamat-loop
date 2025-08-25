# Online checks

Références : [backend/.env.online.staging.example](../backend/.env.online.staging.example) et [backend/.env.tokens.staging.example](../backend/.env.tokens.staging.example).

🔧 Étapes opérateur immédiates (à inclure telles quelles dans docs/online-checks.md)

1) Crée backend/.env.online.staging avec au minimum :

BACKEND_BASE_URL=http://localhost:5000      # ou ton URL staging
ONLINE_TESTS_ENABLE=true

# Choisir l'une des 2 options pour l'auth provider :
TEST_PROVIDER_EMAIL=provider@test.ma
TEST_PROVIDER_PASSWORD=xxxxxx
# OU fournir un token direct :
# PROVIDER_BEARER_TOKEN=eyJhbGciOi...

# Pour les checks paiements/KYC (obligatoires si runner strict)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_IDENTITY_WEBHOOK_SECRET=whsec_identity_xxx


2) Si des routes admin sont vérifiées (webhooks status, go-live, etc.), ajoute backend/.env.tokens.staging :

ADMIN_BEARER_TOKEN=eyJhbGciOi...
# ou
TEST_ADMIN_EMAIL=admin@test.ma
TEST_ADMIN_PASSWORD=xxxxxx


3) Lance la séquence staging :

npm --prefix backend run staging:oneclick
# ou pas à pas :
npm --prefix backend run tokens:get:staging
npm --prefix backend run ops:all:staging


4) Pas de clés Stripe/KYC ? Active le mode tolérant :

ONLINE_STRICT=false npm --prefix backend run online:run-all

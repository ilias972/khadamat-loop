# Admin provisioning

Admin accounts are created manually via a dedicated script. No admin or demo accounts are seeded automatically.

## Create an admin

1. Export the required environment variables:

   ```bash
   export SEED_ADMIN_EMAIL="admin@example.com"
   export SEED_ADMIN_PASSWORD="StrongPassword1!"
   # optional
   export SEED_ADMIN_FIRSTNAME="Jane"
   export SEED_ADMIN_LASTNAME="Doe"
   ```

2. Run the script from the backend directory:

   ```bash
   cd backend
   npm run admin:create
   ```

The script aborts if the email already exists and never runs automatically at startup.

## Production requirements

- Execute the creation script only during controlled operations.
- After creation, the administrator must log in and enable two‑factor authentication before obtaining elevated access.
- Store all secrets (JWT, Stripe, encryption keys, SMTP, etc.) in a secure secret manager.
- Disabled accounts cannot log in; use this to revoke access when needed.

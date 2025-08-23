const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../../.env.online.local');
if (fs.existsSync(file)) {
  process.exit(0);
}
const content = `BACKEND_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=test@example.com
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
`;
fs.writeFileSync(file, content);


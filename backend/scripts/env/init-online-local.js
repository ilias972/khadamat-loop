const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../../.env.online.local');
if (fs.existsSync(file)) {
  process.exit(0);
}
const content = `BACKEND_BASE_URL=http://localhost:3000
BACKEND_HEALTH_PATH=/health
BACKEND_WAIT_TIMEOUT_MS=15000
BACKEND_WAIT_RETRY_MS=1000
START_BACKEND_FOR_TESTS=false
START_BACKEND_CMD=auto
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=test@example.com
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
`;
fs.writeFileSync(file, content);


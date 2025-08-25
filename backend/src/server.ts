import { startServer } from './app';

startServer().catch((e) => {
  console.error(e);
  process.exit(1);
});

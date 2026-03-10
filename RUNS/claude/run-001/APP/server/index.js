import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connect } from './lib/db.js';
import app from './app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env') });

const PORT = process.env.PORT || 3000;

async function start() {
  await connect();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});

export default app;

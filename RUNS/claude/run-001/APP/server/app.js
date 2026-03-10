import express from 'express';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import apiRoutes from './routes/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', apiRoutes);

const webDist = resolve(__dirname, '..', 'web', 'dist');
if (existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get('*', (_req, res) => {
    res.sendFile(join(webDist, 'index.html'));
  });
}

export default app;

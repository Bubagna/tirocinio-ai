import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connect, disconnect } from '../lib/db.js';
import app from '../app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '..', '.env') });

let server;
let baseUrl;

before(async () => {
  await connect();
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  if (server) server.close();
  await disconnect();
});

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
  });
});

describe('GET /api/summary', () => {
  it('returns 200 with kpis', async () => {
    const res = await fetch(`${baseUrl}/api/summary`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.kpis, 'response should have kpis');
    assert.ok('total_suggestions' in body.kpis);
    assert.ok('acceptance_rate' in body.kpis);
  });

  it('returns report period', async () => {
    const res = await fetch(`${baseUrl}/api/summary`);
    const body = await res.json();
    assert.ok(body.report_start_day, 'should have report_start_day');
    assert.ok(body.report_end_day, 'should have report_end_day');
  });
});

describe('GET /api/trends', () => {
  it('returns timeseries array', async () => {
    const res = await fetch(`${baseUrl}/api/trends`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.timeseries), 'timeseries should be an array');
    assert.ok(body.timeseries.length > 0, 'timeseries should not be empty');
  });
});

describe('GET /api/users/top', () => {
  it('returns users array with default limit', async () => {
    const res = await fetch(`${baseUrl}/api/users/top`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.users), 'users should be an array');
    assert.ok(body.users.length <= 20, 'default limit should be 20');
  });

  it('respects limit parameter', async () => {
    const res = await fetch(`${baseUrl}/api/users/top?limit=5`);
    const body = await res.json();
    assert.equal(body.users.length, 5);
  });
});

import { config } from 'dotenv';
import { resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { connect, disconnect } from '../lib/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '..', '.env') });

function deducePrefix(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('enterprise')) return 'enterprise';
  if (lower.includes('users') || lower.includes('user')) return 'users';
  return 'unknown';
}

async function main() {
  const rawDir = process.env.RAW_DATA_DIR;

  if (!rawDir) {
    console.error('ERROR: RAW_DATA_DIR environment variable is not set.');
    process.exit(1);
  }

  const absDir = resolve(rawDir);

  if (!existsSync(absDir)) {
    console.error(`ERROR: RAW_DATA_DIR does not exist: ${absDir}`);
    process.exit(1);
  }

  const jsonFiles = readdirSync(absDir).filter(
    (f) => extname(f).toLowerCase() === '.json' && f !== 'metadata.json',
  );

  if (jsonFiles.length === 0) {
    console.warn('WARNING: No JSON files found in RAW_DATA_DIR. Nothing to import.');
    process.exit(0);
  }

  console.log(`Found ${jsonFiles.length} JSON file(s) in ${absDir}`);

  const { db } = await connect();
  const collection = db.collection('reports_raw');

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of jsonFiles) {
    const filePath = resolve(absDir, file);
    try {
      const existing = await collection.findOne({ filename: file });
      if (existing) {
        console.log(`  SKIP (already exists): ${file}`);
        skipped++;
        continue;
      }

      const raw = readFileSync(filePath, 'utf-8');
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch {
        // Fallback: try JSONL (one JSON object per line)
        const lines = raw.split('\n').filter((l) => l.trim());
        payload = lines.map((line, i) => {
          try { return JSON.parse(line); }
          catch { throw new Error(`Invalid JSON at line ${i + 1}`); }
        });
      }

      await collection.insertOne({
        filename: file,
        report_prefix: deducePrefix(file),
        ingested_at: new Date().toISOString(),
        payload,
      });

      console.log(`  IMPORTED: ${file}`);
      imported++;
    } catch (err) {
      console.error(`  ERROR on ${file}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}, Errors: ${errors}`);

  await disconnect();
}

main().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});

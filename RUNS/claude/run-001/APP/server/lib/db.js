import { MongoClient } from 'mongodb';

let client;
let _db;

export async function connect() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/copilot_metrics';
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  _db = client.db();
  console.log(`Connected to MongoDB: ${_db.databaseName}`);
  return { client, db: _db };
}

export function getDb() {
  if (!_db) throw new Error('Database not connected. Call connect() first.');
  return _db;
}

export async function disconnect() {
  if (client) await client.close();
}

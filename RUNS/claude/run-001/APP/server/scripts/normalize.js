import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { connect, disconnect } from '../lib/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '..', '.env') });

function normalizeEnterprise(doc) {
  const p = doc.payload;
  const days = Array.isArray(p.day_totals) ? p.day_totals : [];

  const kpis = {
    total_days: days.length,
    total_suggestions: 0,
    total_acceptances: 0,
    total_interactions: 0,
    total_loc_suggested: 0,
    total_loc_added: 0,
    monthly_active_users: 0,
    monthly_active_chat_users: 0,
    monthly_active_agent_users: 0,
  };

  const timeseries = [];

  for (const d of days) {
    kpis.total_suggestions += d.code_generation_activity_count || 0;
    kpis.total_acceptances += d.code_acceptance_activity_count || 0;
    kpis.total_interactions += d.user_initiated_interaction_count || 0;
    kpis.total_loc_suggested += d.loc_suggested_to_add_sum || 0;
    kpis.total_loc_added += d.loc_added_sum || 0;

    if ((d.monthly_active_users || 0) > kpis.monthly_active_users)
      kpis.monthly_active_users = d.monthly_active_users;
    if ((d.monthly_active_chat_users || 0) > kpis.monthly_active_chat_users)
      kpis.monthly_active_chat_users = d.monthly_active_chat_users;
    if ((d.monthly_active_agent_users || 0) > kpis.monthly_active_agent_users)
      kpis.monthly_active_agent_users = d.monthly_active_agent_users;

    timeseries.push({
      day: d.day,
      daily_active_users: d.daily_active_users || 0,
      suggestions: d.code_generation_activity_count || 0,
      acceptances: d.code_acceptance_activity_count || 0,
      interactions: d.user_initiated_interaction_count || 0,
      loc_suggested: d.loc_suggested_to_add_sum || 0,
      loc_added: d.loc_added_sum || 0,
    });
  }

  if (kpis.total_suggestions > 0) {
    kpis.acceptance_rate = +(kpis.total_acceptances / kpis.total_suggestions * 100).toFixed(2);
  }

  timeseries.sort((a, b) => a.day.localeCompare(b.day));

  return {
    source_filename: doc.filename,
    report_prefix: doc.report_prefix,
    report_start_day: p.report_start_day || null,
    report_end_day: p.report_end_day || null,
    normalized_at: new Date().toISOString(),
    metrics: { kpis, timeseries },
  };
}

function normalizeUsers(doc) {
  const rows = Array.isArray(doc.payload) ? doc.payload : [];

  const userMap = new Map();
  let reportStart = null;
  let reportEnd = null;

  for (const r of rows) {
    if (!reportStart && r.report_start_day) reportStart = r.report_start_day;
    if (!reportEnd && r.report_end_day) reportEnd = r.report_end_day;

    const login = r.user_login || 'unknown';
    const prev = userMap.get(login) || {
      user_login: login,
      suggestions: 0,
      acceptances: 0,
      interactions: 0,
      loc_suggested: 0,
      loc_added: 0,
      used_agent: false,
      used_chat: false,
      days_active: 0,
    };

    prev.suggestions += r.code_generation_activity_count || 0;
    prev.acceptances += r.code_acceptance_activity_count || 0;
    prev.interactions += r.user_initiated_interaction_count || 0;
    prev.loc_suggested += r.loc_suggested_to_add_sum || 0;
    prev.loc_added += r.loc_added_sum || 0;
    if (r.used_agent) prev.used_agent = true;
    if (r.used_chat) prev.used_chat = true;
    prev.days_active += 1;

    userMap.set(login, prev);
  }

  const allUsers = [...userMap.values()];

  const kpis = {
    total_users: allUsers.length,
    users_with_agent: allUsers.filter((u) => u.used_agent).length,
    users_with_chat: allUsers.filter((u) => u.used_chat).length,
    total_suggestions: allUsers.reduce((s, u) => s + u.suggestions, 0),
    total_acceptances: allUsers.reduce((s, u) => s + u.acceptances, 0),
  };

  const top_users = allUsers
    .sort((a, b) => b.acceptances - a.acceptances)
    .slice(0, 50)
    .map((u) => ({
      user_login: u.user_login,
      suggestions: u.suggestions,
      acceptances: u.acceptances,
      interactions: u.interactions,
      loc_added: u.loc_added,
      days_active: u.days_active,
      used_agent: u.used_agent,
    }));

  return {
    source_filename: doc.filename,
    report_prefix: doc.report_prefix,
    report_start_day: reportStart,
    report_end_day: reportEnd,
    normalized_at: new Date().toISOString(),
    metrics: { kpis, top_users },
  };
}

async function main() {
  const { db } = await connect();
  const rawCol = db.collection('reports_raw');
  const normCol = db.collection('reports_normalized');

  const docs = await rawCol.find({}).toArray();
  console.log(`Found ${docs.length} raw document(s) to normalize`);

  let upserted = 0;

  for (const doc of docs) {
    try {
      let normalized;
      if (doc.report_prefix === 'enterprise') {
        normalized = normalizeEnterprise(doc);
      } else if (doc.report_prefix === 'users') {
        normalized = normalizeUsers(doc);
      } else {
        console.warn(`  SKIP unknown prefix: ${doc.filename}`);
        continue;
      }

      await normCol.updateOne(
        { source_filename: normalized.source_filename },
        { $set: normalized },
        { upsert: true },
      );

      const days = normalized.metrics.timeseries?.length ?? 0;
      const users = normalized.metrics.top_users?.length ?? 0;
      console.log(`  UPSERTED: ${doc.filename} (prefix=${doc.report_prefix}, timeseries=${days}, top_users=${users})`);
      upserted++;
    } catch (err) {
      console.error(`  ERROR on ${doc.filename}: ${err.message}`);
    }
  }

  console.log(`\nDone. Upserted: ${upserted}/${docs.length}`);
  await disconnect();
}

main().catch((err) => {
  console.error(`FATAL: ${err.message}`);
  process.exit(1);
});

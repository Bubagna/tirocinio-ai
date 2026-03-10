import { Router } from 'express';
import { getDb } from '../lib/db.js';

const router = Router();

// GET /api/summary
router.get('/summary', async (_req, res) => {
  try {
    const db = getDb();
    const norm = db.collection('reports_normalized');

    const enterprise = await norm.findOne({ report_prefix: 'enterprise' });
    const users = await norm.findOne({ report_prefix: 'users' });

    if (!enterprise && !users) {
      return res.status(404).json({ error: 'No normalized data found. Run ingest:normalize first.' });
    }

    const entKpis = enterprise?.metrics?.kpis || {};
    const usrKpis = users?.metrics?.kpis || {};

    res.json({
      report_start_day: enterprise?.report_start_day || users?.report_start_day || null,
      report_end_day: enterprise?.report_end_day || users?.report_end_day || null,
      kpis: {
        monthly_active_users: entKpis.monthly_active_users ?? 0,
        total_suggestions: entKpis.total_suggestions ?? 0,
        total_acceptances: entKpis.total_acceptances ?? 0,
        acceptance_rate: entKpis.acceptance_rate ?? 0,
        total_interactions: entKpis.total_interactions ?? 0,
        total_loc_added: entKpis.total_loc_added ?? 0,
        total_users: usrKpis.total_users ?? 0,
        users_with_agent: usrKpis.users_with_agent ?? 0,
        users_with_chat: usrKpis.users_with_chat ?? 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/top?limit=20
router.get('/users/top', async (req, res) => {
  try {
    const db = getDb();
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

    const users = await db.collection('reports_normalized').findOne({ report_prefix: 'users' });

    if (!users?.metrics?.top_users) {
      return res.status(404).json({ error: 'No user data found.' });
    }

    res.json({
      report_start_day: users.report_start_day,
      report_end_day: users.report_end_day,
      users: users.metrics.top_users.slice(0, limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trends
router.get('/trends', async (_req, res) => {
  try {
    const db = getDb();
    const enterprise = await db.collection('reports_normalized').findOne({ report_prefix: 'enterprise' });

    if (!enterprise?.metrics?.timeseries) {
      return res.status(404).json({ error: 'No timeseries data found.' });
    }

    res.json({
      report_start_day: enterprise.report_start_day,
      report_end_day: enterprise.report_end_day,
      timeseries: enterprise.metrics.timeseries,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

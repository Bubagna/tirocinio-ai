import { useState, useEffect } from 'react';
import KpiCards from './components/KpiCards';
import TrendsCharts from './components/TrendsCharts';
import UsersTable from './components/UsersTable';
import './index.css';

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

export default function App() {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchJson('/api/summary'),
      fetchJson('/api/trends'),
      fetchJson('/api/users/top?limit=20'),
    ])
      .then(([s, t, u]) => {
        setSummary(s);
        setTrends(t);
        setUsers(u);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error">Error: {error}</div>;
  if (!summary) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Copilot Metrics Dashboard</h1>
        <p className="period">
          Report period: {summary.report_start_day} &rarr; {summary.report_end_day}
        </p>
      </header>

      <KpiCards kpis={summary.kpis} />

      {trends && <TrendsCharts timeseries={trends.timeseries} />}

      {users && <UsersTable users={users.users} />}
    </div>
  );
}

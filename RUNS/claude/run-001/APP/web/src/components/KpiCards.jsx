const fmt = (n) => (n ?? 0).toLocaleString('en-US');

const cards = [
  { key: 'monthly_active_users', label: 'Monthly Active Users', format: fmt },
  { key: 'total_suggestions', label: 'Code Suggestions', format: fmt },
  { key: 'acceptance_rate', label: 'Acceptance Rate', format: (v) => `${v ?? 0}%` },
];

export default function KpiCards({ kpis }) {
  return (
    <div className="kpi-grid">
      {cards.map(({ key, label, format }) => (
        <div key={key} className="kpi-card">
          <span className="kpi-value">{format(kpis[key])}</span>
          <span className="kpi-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

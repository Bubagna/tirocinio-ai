import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

function formatDay(day) {
  return day?.slice(5) ?? '';
}

export default function TrendsCharts({ timeseries }) {
  const data = timeseries.map((d) => ({ ...d, dayLabel: formatDay(d.day) }));

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3>Suggestions &amp; Acceptances</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayLabel" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="suggestions"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              name="Suggestions"
            />
            <Line
              type="monotone"
              dataKey="acceptances"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Acceptances"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Daily Active Users</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayLabel" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="daily_active_users" fill="#6366f1" name="Active Users" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

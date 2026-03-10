const fmt = (n) => (n ?? 0).toLocaleString('en-US');

export default function UsersTable({ users }) {
  return (
    <div className="table-card">
      <h3>Top Users</h3>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Suggestions</th>
              <th>Acceptances</th>
              <th>LOC Added</th>
              <th>Days Active</th>
              <th>Agent</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.user_login}>
                <td>{i + 1}</td>
                <td className="user-login">{u.user_login}</td>
                <td>{fmt(u.suggestions)}</td>
                <td>{fmt(u.acceptances)}</td>
                <td>{fmt(u.loc_added)}</td>
                <td>{u.days_active}</td>
                <td>{u.used_agent ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

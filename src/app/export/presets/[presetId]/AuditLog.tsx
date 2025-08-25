'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams, useRouter } from "next/navigation";

export default function AuditLogTable() {
  const { presetId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState('');
  const [action, setAction] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch user list for filter dropdown
  useEffect(() => {
    axios.get('/api/v1/users').then(res => setUsers(res.data));
  }, []);

  const fetchLogs = () => {
    const params: any = { presetId };
    if (user) params.user = user;
    if (action) params.action = action;
    if (start) params.start = start;
    if (end) params.end = end;
    axios.get('/api/v1/export/preset-audits', { params })
      .then(res => setLogs(res.data));
  };

  useEffect(() => { fetchLogs(); }, [presetId, user, action, start, end]);

  // For export with current filters
  const buildExportUrl = () => {
    const params = new URLSearchParams({ presetId });
    if (user) params.set('user', user);
    if (action) params.set('action', action);
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    return `/api/v1/export/preset-audits/export?${params.toString()}`;
  };

  return (
    <div>
      <div className="mb-2 flex gap-2 items-end">
        <select value={user} onChange={e => setUser(e.target.value)} className="border rounded p-1">
          <option value="">All Users</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.email || u.name}</option>)}
        </select>
        <select value={action} onChange={e => setAction(e.target.value)} className="border rounded p-1">
          <option value="">All Actions</option>
          <option value="shared_with_user">Shared with user</option>
          <option value="unshared_with_user">Unshared with user</option>
          <option value="shared_with_role">Shared with role</option>
          <option value="unshared_with_role">Unshared with role</option>
        </select>
        <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border rounded p-1" />
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border rounded p-1" />
        <button onClick={fetchLogs} className="bg-blue-600 text-white px-2 py-1 rounded">Search</button>
        <a
          href={buildExportUrl()}
          className="bg-green-700 text-white px-4 py-2 rounded ml-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Filtered Audit Log CSV
        </a>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Timestamp</th><th>Action</th><th>Actor</th><th>Target User</th><th>Target Role</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{(new Date(l.created_at)).toLocaleString()}</td>
              <td>{l.action}</td>
              <td>{l.actor?.email || l.actor?.id}</td>
              <td>{l.target_user_id || ''}</td>
              <td>{l.target_role || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
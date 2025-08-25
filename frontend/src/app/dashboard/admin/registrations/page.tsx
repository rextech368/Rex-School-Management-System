'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminRegistrationsPage() {
  const [regs, setRegs] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/registrations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setRegs(res.data))
      .catch(() => setError('Failed to load registrations'));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.put(`/api/v1/registrations/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRegs(regs.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Registration Queue</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {regs.map(r => (
            <tr key={r.id}>
              <td>{r.applicant_name}</td>
              <td>{r.desired_class?.name}</td>
              <td>{r.desired_section?.name}</td>
              <td>{r.status}</td>
              <td>
                {r.status === 'pending' && (
                  <>
                    <button className="bg-green-600 text-white px-2 py-1 mr-2" onClick={() => updateStatus(r.id, 'accepted')}>Accept</button>
                    <button className="bg-red-600 text-white px-2 py-1" onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
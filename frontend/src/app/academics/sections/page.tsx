'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Section = { id: number; name: string; class?: { name: string } };

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/sections', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setSections(res.data))
      .catch(() => setError('Failed to load sections'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Sections</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {sections.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.class?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
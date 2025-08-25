'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Level = { id: number; name: string; description?: string; };

export default function LevelsPage() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/levels', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setLevels(res.data))
      .catch(() => setError('Failed to load levels'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Levels</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {levels.map(l => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
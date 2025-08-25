'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Class = {
  id: number;
  name: string;
  code: string;
  group_type: string;
  default_promotion_threshold: number;
  level?: { name: string };
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/classes', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setClasses(res.data))
      .catch(() => setError('Failed to load classes'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Classes</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Level</th>
            <th>Code</th>
            <th>Group</th>
            <th>Promotion Threshold</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.level?.name}</td>
              <td>{c.code}</td>
              <td>{c.group_type}</td>
              <td>{c.default_promotion_threshold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
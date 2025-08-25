'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Subject = { id: number; code: string; name: string; coefficient: number; hours_per_week: number; };

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/subjects', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setSubjects(res.data))
      .catch(() => setError('Failed to load subjects'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Subjects</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Coefficient</th>
            <th>Hours/Week</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(s => (
            <tr key={s.id}>
              <td>{s.code}</td>
              <td>{s.name}</td>
              <td>{s.coefficient}</td>
              <td>{s.hours_per_week}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
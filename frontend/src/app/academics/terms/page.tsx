'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type Term = {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  sequence_count: number;
  academic_year?: { name: string };
};

export default function TermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/terms', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setTerms(res.data))
      .catch(() => setError('Failed to load terms'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Terms</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Academic Year</th>
            <th>Start</th>
            <th>End</th>
            <th>Seq</th>
          </tr>
        </thead>
        <tbody>
          {terms.map(t => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.academic_year?.name}</td>
              <td>{t.start_date}</td>
              <td>{t.end_date}</td>
              <td>{t.sequence_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
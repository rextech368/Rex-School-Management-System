'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type AcademicYear = { id: number; name: string; start_date: string; end_date: string; is_active: boolean; };

export default function AcademicYearsPage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/v1/academic-years', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setYears(res.data))
      .catch(() => setError('Failed to load academic years'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Academic Years</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Active?</th>
          </tr>
        </thead>
        <tbody>
          {years.map(y => (
            <tr key={y.id}>
              <td>{y.name}</td>
              <td>{y.start_date}</td>
              <td>{y.end_date}</td>
              <td>{y.is_active ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  useEffect(() => {
    axios.get('/api/v1/exams', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setExams(res.data));
  }, []);
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Exams</h1>
      <table className="w-full border">
        <thead>
          <tr><th>Name</th><th>Term</th><th>Year</th><th>Start</th><th>End</th></tr>
        </thead>
        <tbody>
          {exams.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.term?.name}</td>
              <td>{e.academic_year?.name}</td>
              <td>{e.start_date}</td>
              <td>{e.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function StudentResultPage() {
  const { studentId, examId } = useParams();
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get(`/api/v1/results/student/${studentId}/exam/${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setResults(res.data))
      .catch(() => setError('Failed to load results'));
  }, [studentId, examId]);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Exam Results</h1>
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.subject.id}>
              <td>{r.subject.name}</td>
              <td>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
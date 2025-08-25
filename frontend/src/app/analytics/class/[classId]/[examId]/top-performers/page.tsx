'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function TopPerformersPage() {
  const { classId, examId } = useParams();
  const [performers, setPerformers] = useState<any[]>([]);
  useEffect(() => {
    axios.get(`/api/v1/analytics/class/${classId}/exam/${examId}/top-performers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setPerformers(res.data));
  }, [classId, examId]);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Top Performers</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {performers.map((p, idx) => (
            <tr key={p.id}>
              <td>{idx + 1}</td>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.totalscore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
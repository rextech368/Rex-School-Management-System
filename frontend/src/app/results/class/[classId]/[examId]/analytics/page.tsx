'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ClassAnalyticsPage() {
  const { classId, examId } = useParams();
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get(`/api/v1/results/class/${classId}/exam/${examId}/analytics`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setAnalytics(res.data))
      .catch(() => setError('Failed to load analytics'));
  }, [classId, examId]);
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Class Analytics</h1>
      {error && <div className="text-red-600">{error}</div>}
      {analytics && (
        <div>
          <div><b>Class Average:</b> {analytics.classAverage.toFixed(2)}</div>
          <div><b>Total Students:</b> {analytics.totalStudents}</div>
        </div>
      )}
    </div>
  );
}
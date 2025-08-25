'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdvancedAnalyticsWidget({ classId, examId }: { classId: string, examId: string }) {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    axios.get(`/api/v1/report-cards/email-dashboard/advanced-analytics?class_id=${classId}&exam_id=${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setStats(res.data));
  }, [classId, examId]);
  if (!stats) return <div>Loading analytics...</div>;
  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="font-bold mb-2">Class Performance Analytics</h2>
      <div><b>Average Score:</b> {stats.average.toFixed(2)}</div>
      <div><b>Pass Rate:</b> {stats.passRate?.toFixed(1) ?? 'N/A'}%</div>
      <div><b>Top Students:</b> {stats.topPerformers?.map(s => s.name).join(', ')}</div>
      <div><b>Bottom Students:</b> {stats.bottomPerformers?.map(s => s.name).join(', ')}</div>
      <div>
        <b>Subject Averages:</b>
        <ul>
          {stats.subjectStats?.map((s: any) => (
            <li key={s.subject}>{s.subject}: {s.average.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
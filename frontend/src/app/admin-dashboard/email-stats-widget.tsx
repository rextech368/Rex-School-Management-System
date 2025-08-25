'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmailStatsWidget({ classId, examId }: { classId: string, examId: string }) {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    axios.get(`/api/v1/report-cards/email-dashboard/stats?class_id=${classId}&exam_id=${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setStats(res.data));
  }, [classId, examId]);
  if (!stats) return <div>Loading email stats...</div>;
  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="font-bold mb-2">Report Card Email Status</h2>
      <div className="flex gap-4">
        <div><b>Sent:</b> {stats.sent}</div>
        <div><b>Delivered:</b> {stats.delivered}</div>
        <div className="text-yellow-700"><b>Pending:</b> {stats.pending}</div>
        <div className="text-red-700"><b>Failed:</b> {stats.failed}</div>
        <div className="text-red-700"><b>Bounced:</b> {stats.bounced}</div>
      </div>
    </div>
  );
}
'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function NotificationAnalyticsWidget({ classId, examId }: { classId: string, examId: string }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    axios.get(`/api/v1/notifications/analytics?class_id=${classId}&exam_id=${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setData(res.data));
  }, [classId, examId]);
  if (!data) return <div>Loading notification analytics...</div>;
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-bold mb-2">Notification Analytics</h2>
      <div><b>Total Sent:</b> {data.total}</div>
      <div><b>Email Open Rate:</b> {data.openRate.toFixed(1)}%</div>
      <div><b>Email Click Rate:</b> {data.clickRate.toFixed(1)}%</div>
      <div><b>SMS Delivered:</b> {data.smsDelivered}</div>
      <div className="text-red-700"><b>SMS Failed:</b> {data.smsFailed}</div>
    </div>
  );
}
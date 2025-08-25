'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReportCardNotification({ studentId, examId }: { studentId: string, examId: string }) {
  const [status, setStatus] = useState<string>('');
  useEffect(() => {
    axios.get(`/api/v1/report-cards/email-logs?student_id=${studentId}&exam_id=${examId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      const log = res.data[0];
      if (log?.status === 'sent' || log?.status === 'delivered') {
        setStatus('Your child’s report card has been sent to your email.');
      } else if (log?.status === 'failed' || log?.status === 'bounced') {
        setStatus('We could not deliver the report card. Please check your email address in your profile.');
      }
    });
  }, [studentId, examId]);
  return <div className="my-4">{status && <div className="bg-yellow-100 p-3 rounded">{status}</div>}</div>;
}
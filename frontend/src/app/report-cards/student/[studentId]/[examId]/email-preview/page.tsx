'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function StudentEmailPreviewPage() {
  const { studentId, examId } = useParams();
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    axios.get(`/api/v1/report-cards/student/${studentId}/exam/${examId}/email-preview`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setHtml(res.data.html));
  }, [studentId, examId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Email Preview</h1>
      <div className="border rounded p-4" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
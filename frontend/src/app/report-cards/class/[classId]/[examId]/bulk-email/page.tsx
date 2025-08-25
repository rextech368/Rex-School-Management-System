'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function BulkReportCardEmailPage() {
  const { classId, examId } = useParams();
  const [result, setResult] = useState<any>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    try {
      const res = await axios.post(`/api/v1/report-cards/class/${classId}/exam/${examId}/bulk-email`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResult(res.data);
    } catch {
      setResult({ failed: 0, sent: 0, errors: ['Failed to start bulk email.'] });
    }
    setSending(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bulk Email Report Cards</h1>
      <button
        onClick={handleSend}
        disabled={sending}
        className="bg-blue-700 px-4 py-2 text-white rounded"
      >
        {sending ? 'Sending...' : 'Send All Report Cards'}
      </button>
      {result && (
        <div className="mt-4">
          <div><b>Sent:</b> {result.sent}</div>
          <div><b>Failed:</b> {result.failed}</div>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 text-red-600">
              <b>Errors:</b>
              <ul className="list-disc ml-4">
                {result.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
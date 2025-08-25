'use client';
import { useParams } from 'next/navigation';

export default function AnalyticsExportWidget() {
  const { classId, examId } = useParams();
  const url = `/api/v1/report-cards/export/analytics.csv?class_id=${classId}&exam_id=${examId}`;
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-bold mb-2">Export Analytics</h2>
      <a
        href={url}
        className="bg-blue-700 text-white px-4 py-2 rounded"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download CSV
      </a>
    </div>
  );
}
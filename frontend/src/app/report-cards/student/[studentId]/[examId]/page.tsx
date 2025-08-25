'use client';
import { useParams } from 'next/navigation';

export default function ReportCardDownloadPage() {
  const { studentId, examId } = useParams();
  const url = `/api/v1/report-cards/student/${studentId}/exam/${examId}/pdf`;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Download Report Card</h1>
      <a href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded">Download PDF</a>
    </div>
  );
}
'use client';
import { useParams } from 'next/navigation';

export default function BulkReportCardDownloadPage() {
  const { classId, examId } = useParams();
  const url = `/api/v1/report-cards/class/${classId}/exam/${examId}/bulk`;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Bulk Report Card Download</h1>
      <a href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-700 text-white rounded">Download ZIP</a>
      <p className="mt-2 text-sm text-gray-600">This will generate and download all student report cards as a ZIP file.</p>
    </div>
  );
}
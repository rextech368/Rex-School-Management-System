'use client';
import { useParams } from 'next/navigation';

export default function StudentExportWidget() {
  const { studentId, examId } = useParams();
  const csvUrl = `/api/v1/students/export/${studentId}/${examId}.csv`;
  const pdfUrl = `/api/v1/students/export/${studentId}/${examId}.pdf`;
  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-bold mb-2">Export Results</h2>
      <div className="flex gap-4">
        <a
          href={csvUrl}
          className="bg-blue-700 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download CSV
        </a>
        <a
          href={pdfUrl}
          className="bg-green-700 text-white px-4 py-2 rounded"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
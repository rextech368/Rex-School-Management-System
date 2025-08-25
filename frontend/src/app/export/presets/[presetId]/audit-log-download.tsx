import { useSearchParams, useParams } from "next/navigation";

export default function AuditLogDownloadButton() {
  const { presetId } = useParams();
  const searchParams = useSearchParams();
  // Build query string from current search params (user, action, start, end, etc.)
  const params = new URLSearchParams({ presetId });
  ['user', 'action', 'start', 'end'].forEach(key => {
    const value = searchParams.get(key);
    if (value) params.set(key, value);
  });
  const url = `/api/v1/export/preset-audits/export?${params.toString()}`;
  return (
    <a
      href={url}
      className="bg-blue-700 text-white px-4 py-2 rounded"
      target="_blank"
      rel="noopener noreferrer"
    >
      Download Filtered Audit Log CSV
    </a>
  );
}
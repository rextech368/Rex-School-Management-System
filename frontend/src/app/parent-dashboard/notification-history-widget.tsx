// ...within widget
{logs.some(log => log.status !== 'delivered') && (
  <button
    className="px-4 py-2 bg-blue-700 text-white rounded"
    onClick={() => {
      axios.post(`/api/v1/notifications/remind/${parentId}/${examId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    }}
  >
    Request Reminder
  </button>
)}
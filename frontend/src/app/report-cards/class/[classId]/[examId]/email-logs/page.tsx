// ...existing code
<td>
  {l.status === 'failed' && (
    <button
      className="px-2 py-1 bg-orange-600 text-white rounded"
      onClick={() => {
        axios.post(`/api/v1/report-cards/email-resend/${l.id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }}
    >
      Resend
    </button>
  )}
</td>
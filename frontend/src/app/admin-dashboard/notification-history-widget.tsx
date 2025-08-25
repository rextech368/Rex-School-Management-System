// ...within table row
<td>
  {log.status !== 'delivered' && (
    <button
      className="px-2 py-1 bg-yellow-600 text-white rounded"
      onClick={() => {
        axios.post(`/api/v1/notifications/resend/${log.id}`, {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }}
    >
      Resend
    </button>
  )}
</td>
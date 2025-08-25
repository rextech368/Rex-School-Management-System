// Pseudocode for multi-select preset list
const [selectedIds, setSelectedIds] = useState<number[]>([]);
return (
  <>
    <BulkActions selectedIds={selectedIds} refreshList={fetchPresets} />
    <table>
      <thead>
        <tr>
          <th><input type="checkbox" onChange={toggleSelectAll}/></th>
          {/* ... */}
        </tr>
      </thead>
      <tbody>
        {presets.map(p => (
          <tr key={p.id}>
            <td><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)}/></td>
            {/* ... */}
          </tr>
        ))}
      </tbody>
    </table>
  </>
);
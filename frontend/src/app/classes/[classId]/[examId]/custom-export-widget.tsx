// ...inside the preset edit form
<select multiple value={selectedUsers} onChange={e => setSelectedUsers(Array.from(e.target.selectedOptions, o => o.value))}>
  {availableUsers.map((u: any) => (
    <option key={u.id} value={u.id}>{u.name || u.email}</option>
  ))}
</select>
<select multiple value={selectedRoles} onChange={e => setSelectedRoles(Array.from(e.target.selectedOptions, o => o.value))}>
  {availableRoles.map((r: string) => (
    <option key={r} value={r}>{r}</option>
  ))}
</select>
// Users/roles can be removed by unselecting them
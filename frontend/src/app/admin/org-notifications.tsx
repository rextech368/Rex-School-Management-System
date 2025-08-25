import { useState, useEffect } from "react";
import axios from "axios";

export default function OrgNotificationDefaults() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    axios.get('/api/v1/organization/notifications').then(res => {
      setEnabled(res.data.export_preset_shared !== false);
    });
  }, []);
  const save = async (val: boolean) => {
    setEnabled(val);
    await axios.patch('/api/v1/organization/notifications', {
      export_preset_shared: val
    });
  };
  return (
    <div>
      <label className="font-semibold">Org Default: Export Preset Sharing Notifications</label>
      <label className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => save(e.target.checked)}
        />
        Notify users when presets are shared with them (default for new users)
      </label>
    </div>
  );
}
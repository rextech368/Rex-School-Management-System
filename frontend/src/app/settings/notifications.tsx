import { useState, useEffect } from "react";
import axios from "axios";

export default function ExportPresetNotificationPreference() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    axios.get('/api/v1/users/me').then(res => {
      setEnabled(res.data.notification_preferences?.export_preset_shared !== false);
    });
  }, []);
  const save = async (val: boolean) => {
    setEnabled(val);
    await axios.patch('/api/v1/users/me', {
      notification_preferences: { export_preset_shared: val }
    });
  };
  return (
    <div>
      <label className="font-semibold">Export Preset Sharing Notifications</label>
      <label className="flex items-center gap-2 mt-1">
        <input
          type="checkbox"
          checked={enabled}
          onChange={e => save(e.target.checked)}
        />
        Receive notifications when presets are shared with me
      </label>
    </div>
  );
}
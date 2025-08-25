import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function PerPresetNotificationOverride() {
  const { presetId } = useParams();
  const [override, setOverride] = useState<'default'|'on'|'off'>('default');

  useEffect(() => {
    axios.get('/api/v1/users/me').then(res => {
      const v = res.data.notification_preferences?.export_preset_overrides?.[presetId];
      if (v?.shared === true) setOverride('on');
      else if (v?.shared === false) setOverride('off');
      else setOverride('default');
    });
  }, [presetId]);

  const update = async (val: 'default'|'on'|'off') => {
    setOverride(val);
    await axios.patch('/api/v1/users/me/notifications/preset-override', {
      presetId,
      shared: val === 'default' ? null : val === 'on'
    });
  };

  return (
    <div className="my-2 flex items-center gap-2">
      <span>Notifications for this preset:</span>
      <select value={override} onChange={e => update(e.target.value as any)} className="border rounded p-1">
        <option value="default">Use Default</option>
        <option value="on">Always Notify</option>
        <option value="off">Never Notify</option>
      </select>
    </div>
  );
}
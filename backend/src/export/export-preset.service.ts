for (const user of usersToNotify) {
  const prefs = user.notification_preferences || {};
  const presetOverrides = prefs.export_preset_overrides || {};
  let notify = true;
  if (
    presetOverrides[preset.id]?.shared !== undefined
  ) {
    notify = presetOverrides[preset.id].shared;
  } else if (prefs.export_preset_shared !== undefined) {
    notify = prefs.export_preset_shared;
  } else if (user.organization?.notification_defaults?.export_preset_shared !== undefined) {
    notify = user.organization.notification_defaults.export_preset_shared;
  }
  if (!notify) continue;
  // send notification
}
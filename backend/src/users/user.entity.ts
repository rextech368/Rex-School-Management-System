@Entity({ name: 'users' })
export class User {
  // ...existing fields...

  @Column({ type: 'jsonb', nullable: true })
  notification_preferences: {
    export_preset_shared?: boolean;
    export_preset_overrides?: {
      [presetId: number]: {
        shared?: boolean; // true=notify, false=never, undefined=use org/user default
      }
    }
    // ...other notification types...
  };
}
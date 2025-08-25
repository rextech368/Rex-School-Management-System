@Column({ type: 'jsonb', nullable: true })
translations: {
  [locale: string]: { name?: string; description?: string }
};
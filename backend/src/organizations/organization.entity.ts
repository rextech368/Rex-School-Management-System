import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'jsonb', nullable: true })
  notification_defaults: {
    export_preset_shared?: boolean;
    // ...other notification types...
  };
  // ...other fields...
}
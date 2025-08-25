@Entity({ name: 'export_preset_folders' })
export class ExportPresetFolder {
  @PrimaryGeneratedColumn()
  id: number;
  @Column() name: string;
  @ManyToOne(() => ExportPresetFolder, { nullable: true }) parent: ExportPresetFolder;
  @Column() order: number;
  @ManyToOne(() => Organization) organization: Organization;
}
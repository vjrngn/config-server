import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ConfigDataTypes } from '../repositories/enum/config-data-types';
import { ApplicationEnvironment } from './ApplicationEnvironment';

@Entity('configurations')
export class Configuration {
  @Column({ update: false })
  id: string;

  @PrimaryColumn({ name: 'application_environment_id', update: false })
  environment_id: string;

  @PrimaryColumn()
  key: string;

  @Column()
  value: string;

  @Column({ name: 'data_type', type: 'smallint' })
  dataType: ConfigDataTypes;

  @Column({ name: 'secret_path', nullable: true })
  secretPath: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  environment: ApplicationEnvironment;
}

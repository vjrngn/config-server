import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationEnvironment } from './ApplicationEnvironment';

@Entity('configurations')
export class Configuration {
    @PrimaryColumn()
    id: string;

    @Column()
    key: string;

    @Column()
    value: string;

    @Column({ name: 'data_type' })
    dataType: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date

    @ManyToOne(() => ApplicationEnvironment)
    environment: ApplicationEnvironment;
}

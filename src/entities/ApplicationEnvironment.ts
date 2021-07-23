import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';

@Entity('application_environments')
export class ApplicationEnvironment {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date

    @ManyToOne(() => Application)
    application: Application;
}

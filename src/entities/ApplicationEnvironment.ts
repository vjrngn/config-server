import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { Configuration } from './Configuration';

@Entity('application_environments')
export class ApplicationEnvironment {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    application_id: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date

    application: Application;

    @OneToMany(() => Configuration, config => config.environment)
    configurations: Configuration[];
}

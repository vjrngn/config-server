import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Application } from './Application';
import { Configuration } from './Configuration';

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

    @OneToMany(() => Configuration, config => config.environment)
    configurations: Configuration[];
}

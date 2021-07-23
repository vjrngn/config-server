import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './Team';
import { ApplicationEnvironment } from './ApplicationEnvironment';

@Entity('applications')
export class Application {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Team)
    team: Team;

    @OneToMany(() => ApplicationEnvironment, env => env.application)
    environments: ApplicationEnvironment[];
}

import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ApplicationEnvironment } from './ApplicationEnvironment';
import { Team } from './Team';

@Entity('applications')
export class Application {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'team_id' })
    teamId: string;

    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    team: Team;

    @OneToMany(() => ApplicationEnvironment, env => env.application)
    environments: ApplicationEnvironment[];
}

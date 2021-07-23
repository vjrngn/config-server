import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './Team';

@Entity('applications')
export class Application {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Team)
    team: Team;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}

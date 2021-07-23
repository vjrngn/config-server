import { CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './Team';

@Entity('team_members')
export class TeamMember {
    @PrimaryColumn({ name: 'team_id' })
    teamId: string;

    @PrimaryColumn({ name: 'user_id' })
    userId: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    teams: Team[];
}

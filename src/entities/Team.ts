import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TeamMember } from './TeamMember';

@Entity({ name: 'teams' })
export class Team {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    members: TeamMember[];
}

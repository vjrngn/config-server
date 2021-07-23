import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TeamMember } from './TeamMember';
import { Application } from './Application';

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

    @OneToMany(() => Application, application => application.team)
    applications: Application[];
}

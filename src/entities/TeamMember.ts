import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'team_members' })
export class TeamMember {
  @PrimaryColumn({ name: 'team_id' })
  teamId: string;

  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

import { EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/Team';
import { v4 } from 'uuid';
import { BadInputException } from './exceptions/BadInputException';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async createTeam (options: { name: string, members?: string[] }): Promise<Team> {
    if (!options.name || options.name.length === 0) {
      throw new BadInputException('name is required');
    }

    return this.save({
      id: v4(),
      name: options.name
    });
  }
}

import { EntityManager, EntityRepository, Repository } from 'typeorm';
import { Team } from '../entities/Team';
import { v4 } from 'uuid';
import { BadInputException } from './exceptions/BadInputException';
import { TeamMember } from '../entities/TeamMember';
import isEmpty from 'lodash.isempty';
import logger from '../logging/logger';

@EntityRepository(Team)
export class TeamRepository extends Repository<Team> {
  async createTeam (options: { name: string, members?: string[] }): Promise<Team> {
    if (!options.name || options.name.length === 0) {
      logger.error('name not provided');
      throw new BadInputException('name is required');
    }

    logger.debug('attempting to create new team');
    return this.manager.transaction(async (entityManager: EntityManager) => {
      const team = await entityManager.save(Team, {
        id: v4(),
        name: options.name
      });

      if (!isEmpty(options.members)) {
        logger.debug('adding team members');
        const members = options.members!.map((userId) => {
          const teamMember = new TeamMember();
          teamMember.teamId = team.id;
          teamMember.userId = userId;
          return teamMember;
        });

        const teamMembers = await entityManager.save(TeamMember, members);
        team.members = teamMembers;
      }

      return team;
    });
  }
}

import isEmpty from 'lodash.isempty';
import { EntityRepository, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Application } from '../entities/Application';
import { ApplicationEnvironment } from '../entities/ApplicationEnvironment';
import { Result } from '../result';
import { CreateApplicationDTO } from './dto/create-application-dto';
import logger from '../logging/logger';
import { UNIQUE_CONSTRAINT } from './sql-codes';
import { UpdateApplicationDTO } from './dto/update-application-dto';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {
  async createApplication(
    data: CreateApplicationDTO
  ): Promise<Result<Application | null>> {
    try {
      const result = await this.manager.transaction(async (entityManager) => {
        logger.debug('Attempting to create application');
        const application = entityManager.create(Application, {
          id: v4(),
          teamId: data.teamId,
          name: data.name,
          environments: []
        });
        const record = await entityManager.save(application);

        if (!isEmpty(data.environments)) {
          logger.debug('Adding environments as part of application creation');
          const applicationEnvironments = data.environments!.map((envDef) => {
            return entityManager.create(ApplicationEnvironment, {
              id: v4(),
              name: envDef.name,
              application_id: record.id
            });
          });

          const persistedEnvs = await entityManager.save(
            ApplicationEnvironment,
            applicationEnvironments
          );
          record.environments = persistedEnvs;
        }

        return new Result(record, null);
      });

      return result;
    } catch (e) {
      logger.error('Exception creating application', e);
      if (e.code === UNIQUE_CONSTRAINT) {
        return new Result(null, {
          message: `Application with name ${data.name} exists.`
        });
      }

      throw e;
    }
  }

  async updateApplication(
    data: UpdateApplicationDTO
  ): Promise<Result<Application | null>> {
    logger.debug('Attempting to update application', { id: data.id });

    if (isEmpty(data.name.trim())) {
      logger.error('Update failed. name is invalid', { data });
      return new Result(null, {
        message: 'name is required'
      });
    }

    const updatedApp = await this.manager
      .createQueryBuilder()
      .update(Application, {
        name: data.name
      })
      .returning('*')
      .execute()
      .then((response) => response.raw[0]);

    if (!updatedApp) {
      logger.error('Application update failed. Does not exist', { id: data.id });
      return new Result(null, {
        message: 'Application not found'
      });
    }

    return new Result(updatedApp, null);
  }
}

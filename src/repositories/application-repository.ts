import isEmpty from 'lodash.isempty';
import { EntityRepository, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Application } from '../entities/Application';
import { ApplicationEnvironment } from '../entities/ApplicationEnvironment';
import { Result } from '../result';
import { CreateApplicationDTO } from './dto/create-application-dto';

@EntityRepository(Application)
export class ApplicationRepository extends Repository<Application> {
  async createApplication (data: CreateApplicationDTO): Promise<Result<Application | null>> {
    try {
      const result = await this.manager.transaction(async (entityManager) => {
        const application = entityManager.create(Application, {
          id: v4(),
          teamId: data.teamId,
          name: data.name,
          environments: []
        });
        const record = await entityManager.save(application);

        if (!isEmpty(data.environments)) {
          const applicationEnvironments = data.environments!.map((envDef) => {
            return entityManager.create(ApplicationEnvironment, {
              id: v4(),
              name: envDef.name,
              application_id: record.id
            });
          });

          const persistedEnvs = await entityManager.save(ApplicationEnvironment, applicationEnvironments);
          record.environments = persistedEnvs;
        }

        return new Result(record, null);
      });

      return result;
    } catch (e) {
      if (e.code === '23505') {
        return new Result(null, {
          message: `Application with name ${data.name} exists.`
        });
      }

      throw e;
    }
  }
}

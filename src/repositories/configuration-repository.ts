import { EntityRepository, Repository } from 'typeorm';
import { Configuration } from '../entities/Configuration';
import { Result } from '../result';
import { UpdateConfigurationDTO } from './dto/application-configuration/update-configuration-dto';
import { v4 } from 'uuid';
import logger from '../logging/logger';

@EntityRepository(Configuration)
export class ConfigurationRepository extends Repository<Configuration> {
  async updateConfigurations(data: UpdateConfigurationDTO[]): Promise<Result<Configuration[] | null>> {
    logger.debug('attempting to update configurations', data);
    const configs = await this.manager.transaction(async entityManger => {
      const configs = [];
      for (const config of data) {
        const entity = this.create({
          id: v4(),
          key: config.key,
          value: config.value,
          dataType: config.dataType,
          environment_id: config.environmentId,
          secretPath: config.secretPath
        });
        await entityManger.createQueryBuilder()
          .insert()
          .into(Configuration)
          .values(entity)
          .onConflict(`
            (key,application_environment_id) DO UPDATE SET 
            value = :value, 
            data_type = :dataType, 
            secret_path = :secretPath,
            updated_at = :updatedAt
          `)
          .setParameters({
            value: config.value,
            dataType: config.dataType,
            secretPath: config.secretPath,
            updatedAt: new Date().toISOString()
          })
          .execute();

        const mergedConfig = await entityManger.findOne(Configuration, {
          where: {
            key: config.key,
            environment_id: config.environmentId
          }
        }) as Configuration;

        configs.push(mergedConfig);
      }

      return configs;
    });

    return new Result(configs, null);
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'configurations';

export class CreateConfigurationsTable1627074236346 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: TABLE_NAME,
      columns: [
        {
          name: 'id',
          type: 'varchar'
        },
        {
          name: 'application_environment_id',
          type: 'varchar'
        },
        {
          name: 'key',
          type: 'varchar'
        },
        {
          name: 'value',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'data_type',
          type: 'smallint',
          isNullable: false
        },
        {
          name: 'secret_path',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP'
        }
      ]
    }));

    // each configuration key must be unique per application environment
    await queryRunner.createPrimaryKey(TABLE_NAME, ['key', 'application_environment_id']);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}

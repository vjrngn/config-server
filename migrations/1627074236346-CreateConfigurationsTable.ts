import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'configurations';

export class CreateConfigurationsTable1627074236346 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: TABLE_NAME,
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true
        },
        {
          name: 'application_environment_id',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'key',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'value',
          type: 'varchar',
          isNullable: true
        },
        {
          name: 'data_type',
          type: 'varchar',
          isNullable: false
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
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}

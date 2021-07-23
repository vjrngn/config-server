import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const TABLE_NAME = 'configurations';
const APP_ENV_ID_FK = 'fk_application_environment_id';

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

    await queryRunner.createForeignKey(TABLE_NAME, new TableForeignKey({
      name: APP_ENV_ID_FK,
      columnNames: ['application_environment_id'],
      referencedTableName: 'application_environments',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(TABLE_NAME, APP_ENV_ID_FK);
    await queryRunner.dropTable(TABLE_NAME);
  }
}

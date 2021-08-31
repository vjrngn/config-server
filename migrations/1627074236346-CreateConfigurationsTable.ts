import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

const TABLE_NAME = 'configurations';
const FK_ENV_ID = 'fk_environment_id';
const INDEX_UNIQUE_ENV_KEY = 'idx_unique_application_environment_id_key';

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
    await queryRunner.createUniqueConstraint(TABLE_NAME, new TableUnique({
      name: INDEX_UNIQUE_ENV_KEY,
      columnNames: ['key', 'application_environment_id']
    }));
    await queryRunner.createForeignKey(TABLE_NAME, new TableForeignKey({
      name: FK_ENV_ID,
      columnNames: ['application_environment_id'],
      referencedTableName: 'application_environments',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE'
    }));
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(TABLE_NAME, FK_ENV_ID);
    await queryRunner.dropUniqueConstraint(TABLE_NAME, INDEX_UNIQUE_ENV_KEY);
    await queryRunner.dropTable(TABLE_NAME);
  }
}

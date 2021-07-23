import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

const TABLE_NAME = 'application_environments';

export class CreateApplicationEnvironmentsTable1627073628656 implements MigrationInterface {
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
          name: 'application_id',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'name',
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

    await queryRunner.createUniqueConstraint(TABLE_NAME, new TableUnique({
      name: 'idx_unique_application_id_name',
      columnNames: ['application_id', 'name']
    }));
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}

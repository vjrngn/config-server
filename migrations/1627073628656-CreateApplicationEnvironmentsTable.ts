import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from 'typeorm';

const TABLE_NAME = 'application_environments';
const FK_APPLICATION_ID = 'fk_application_id';

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
    await queryRunner.createForeignKey(TABLE_NAME, new TableForeignKey({
      name: FK_APPLICATION_ID,
      columnNames: ['application_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'applications',
      onDelete: 'CASCADE'
    }))
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(TABLE_NAME, FK_APPLICATION_ID);
    await queryRunner.dropTable(TABLE_NAME);
  }
}

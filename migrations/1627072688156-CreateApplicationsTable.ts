import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

const TABLE_NAME = 'applications';

export class CreateApplicationsTable1627072688156 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: TABLE_NAME,
      columns: [{
        name: 'id',
        type: 'varchar',
        isPrimary: true
      }, {
        name: 'team_id',
        type: 'varchar',
        isNullable: false
      }, {
        name: 'name',
        type: 'varchar',
        isNullable: false
      }, {
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP'
      }, {
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP'
      }]
    }));

    await queryRunner.createUniqueConstraint(TABLE_NAME, new TableUnique({
      name: 'idx_unique_team_id_name',
      columnNames: ['team_id', 'name']
    }));
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}

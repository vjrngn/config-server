import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'teams';

export class CreateTeamsTable1626060296735 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    return queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true
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
      })
    );
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable(TABLE_NAME);
  }
}

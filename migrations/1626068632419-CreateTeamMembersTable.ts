import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const TABLE_NAME = 'team_members';

export class CreateTeamMembersTable1626068632419 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          {
            name: 'team_id',
            type: 'varchar',
            isNullable: false
          },
          {
            name: 'user_id',
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
      })
    );

    await queryRunner.createPrimaryKey(TABLE_NAME, ['team_id', 'user_id']);
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}

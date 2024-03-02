import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class DailyLimitMigration1683879557995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'daily_limits',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'expert_house_count',
            type: 'int',
            default: 0,
            comment: 'expert house creation count',
          },
          {
            name: 'online_house_count',
            type: 'int',
            default: 0,
            comment: 'online house creation count',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
            isUnique: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true, // indicates that this table is created only if it doesn't exist yet
    );

    await queryRunner.createForeignKey(
      'daily_limits',
      new TableForeignKey({
        name: 'FK_daily_limits_user_id',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('daily_limits', 'FK_daily_limits_user_id');
    await queryRunner.dropTable('daily_limits', true);
  }
}

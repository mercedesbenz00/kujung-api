import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class ViewLogMigration1683861138162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'view_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'entity_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'view_logs',
      new TableIndex({
        name: 'view-logs-type-idx',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'view_logs',
      new TableIndex({
        name: 'view-logs-user-idx',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'view_logs',
      new TableIndex({
        name: 'UQ_view_logs_type_entity_id_user_id',
        columnNames: ['type', 'entity_id', 'user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'view_logs',
      'UQ_view_logs_type_entity_id_user_id',
    );
    await queryRunner.dropIndex('view_logs', 'view-logs-user-idx');
    await queryRunner.dropIndex('view_logs', 'view-logs-type-idx');
    await queryRunner.dropTable('view_logs');
  }
}

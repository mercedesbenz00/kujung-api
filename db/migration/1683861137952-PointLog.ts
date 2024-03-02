import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class PointLog1683861137952 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'point_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'point',
            type: 'int',
            comment: 'point',
            default: 0,
          },
          {
            name: 'memo',
            type: 'text',
            comment: 'memo',
            isNullable: true,
            default: null,
          },
          {
            name: 'is_direct',
            type: 'bool',
            comment: 'is direct flag',
            default: false,
          },
          {
            name: 'type',
            type: 'varchar',
            comment: 'Point log application type. { direct, order, account }',
            default: "'direct'",
          },
          {
            name: 'created_by',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            default: null,
            isNullable: true,
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
      'point_logs',
      new TableIndex({
        name: 'idx_point_logs_is_direct',
        columnNames: ['is_direct'],
      }),
    );

    await queryRunner.createIndex(
      'point_logs',
      new TableIndex({
        name: 'idx_point_logs_type',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createForeignKey(
      'point_logs',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('point_logs');
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1,
    );
    await queryRunner.dropForeignKey('point_logs', userForeignKey);
    await queryRunner.dropIndex('point_logs', 'idx_point_logs_type');
    await queryRunner.dropIndex('point_logs', 'idx_point_logs_is_direct');
    await queryRunner.dropTable('point_logs');
  }
}

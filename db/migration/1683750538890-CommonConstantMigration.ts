import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CommonConstantMigration1683750538890
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'common_constants',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: false,
            comment: 'Common constant name',
          },
          {
            name: 'type',
            type: 'varchar(255)',
            isNullable: false,
            comment:
              'Common constant type. { color, house_style, area_space, family_type, question_type }',
          },
          {
            name: 'value_num',
            type: 'float',
            isNullable: true,
            comment: 'Common constant number value',
            default: null,
          },
          {
            name: 'priority',
            type: 'int',
            isNullable: true,
            comment: 'Common constant priority',
            default: 0,
          },
          {
            name: 'display',
            type: 'bool',
            default: true,
            isNullable: false,
            comment: 'Common constant display flag',
          },
          {
            name: 'main_display',
            type: 'bool',
            default: false,
            isNullable: false,
            comment: 'Main display flag',
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true, // Adds IF NOT EXISTS to the CREATE TABLE statement
    );

    // Adding indexes
    await queryRunner.createIndex(
      'common_constants',
      new TableIndex({
        name: 'idx_common_constants_name',
        columnNames: ['name'],
      }),
    );
    await queryRunner.createIndex(
      'common_constants',
      new TableIndex({
        name: 'idx_common_constants_type',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'common_constants',
      new TableIndex({
        name: 'UQ_common_constants_name_type',
        columnNames: ['name', 'type'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Removing indexes
    await queryRunner.dropIndex(
      'common_constants',
      'UQ_common_constants_name_type',
    );

    await queryRunner.dropIndex(
      'common_constants',
      'idx_common_constants_name',
    );
    await queryRunner.dropIndex(
      'common_constants',
      'idx_common_constants_type',
    );

    await queryRunner.dropTable('common_constants');
  }
}

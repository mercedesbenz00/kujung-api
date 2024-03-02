import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class SearchTerm1682545017570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'search_terms',
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
            type: 'varchar',
            comment: 'Search term name',
          },
          {
            name: 'priority',
            type: 'tinyint',
            comment: 'Priority',
          },
          {
            name: 'display',
            type: 'bool',
            default: true,
            comment: 'Display flag',
          },
          {
            name: 'main_display',
            type: 'bool',
            comment: 'Main display flag',
            default: false,
          },
          {
            name: 'count',
            type: 'int',
            default: 0,
            comment: 'count',
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['recommend', 'popular'],
            default: 'recommend',
            isNullable: true,
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
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('search_terms');
  }
}

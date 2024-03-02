import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class PortfolioMigration1683861037690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'portfolios',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            comment: 'Portfolio title',
          },
          {
            name: 'summary',
            type: 'varchar',
            length: '2048',
            comment: 'Portfolio summary',
          },
          {
            name: 'content',
            type: 'text',
            comment: 'Portfolio content',
          },
          {
            name: 'category',
            type: 'varchar',
            comment: 'Portfolio category. {brand, convention, artist}',
            isNullable: true,
            default: null,
          },
          {
            name: 'collaboration',
            type: 'varchar',
            comment: 'Portfolio collaboration',
            isNullable: true,
            default: null,
          },
          {
            name: 'place',
            type: 'varchar',
            length: '2048',
            comment: 'Portfolio place',
            isNullable: true,
            default: null,
          },
          {
            name: 'online_info',
            type: 'varchar',
            length: '2048',
            comment: 'Portfolio online info',
            isNullable: true,
            default: null,
          },
          {
            name: 'start_at',
            type: 'datetime(3)',
            comment: 'Start date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'end_at',
            type: 'datetime(3)',
            comment: 'End date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'like_count',
            type: 'int',
            default: 0,
            comment: 'like count',
          },
          {
            name: 'view_count',
            type: 'int',
            default: 0,
            comment: 'view count',
          },
          {
            name: 'created_at',
            type: 'datetime(3)',
            default: 'CURRENT_TIMESTAMP(3)',
          },
          {
            name: 'updated_at',
            type: 'datetime(3)',
            default: 'CURRENT_TIMESTAMP(3)',
            onUpdate: 'CURRENT_TIMESTAMP(3)',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'portfolios',
      new TableIndex({ columnNames: ['title'], name: 'idx_portfolios_title' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('portfolios', 'idx_portfolios_title');
    await queryRunner.dropTable('portfolios');
  }
}

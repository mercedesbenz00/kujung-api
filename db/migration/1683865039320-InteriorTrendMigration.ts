import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InteriorTrendMigration1683865039320 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'interior_trends',
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
            comment: 'Interior trend title',
          },
          {
            name: 'summary',
            type: 'text',
            comment: 'Interior trend summary',
          },
          {
            name: 'video_url',
            type: 'varchar',
            length: '2048',
            comment: 'video url',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url',
            type: 'varchar',
            length: '2048',
            comment: 'video thumb url',
            isNullable: true,
            default: null,
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

    await queryRunner.createIndex(
      'interior_trends',
      new TableIndex({
        columnNames: ['title'],
        name: 'idx_interior_trends_title',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('interior_trends', 'idx_interior_trends_title');
    await queryRunner.dropTable('interior_trends');
  }
}

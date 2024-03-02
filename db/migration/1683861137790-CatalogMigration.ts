import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CatalogMigration1683861137790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'catalogs',
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
            comment: 'Catalog title',
          },
          {
            name: 'summary',
            type: 'varchar',
            length: '2048',
            comment: 'Catalog summary',
          },
          {
            name: 'category',
            type: 'varchar',
            comment: 'Catalog category. {catalog, sample, look}',
            isNullable: true,
            default: null,
          },
          {
            name: 'download_file',
            type: 'varchar',
            length: '2048',
            comment: 'Catalog download file url',
            isNullable: true,
            default: null,
          },
          {
            name: 'preview_file',
            type: 'varchar',
            length: '2048',
            comment: 'Catalog preview file url',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url',
            type: 'varchar',
            length: '2048',
            comment: 'Catalog thumbnail url',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url_mobile',
            type: 'varchar',
            length: '2048',
            comment: 'Catalog mobile thumbnail url',
            isNullable: true,
            default: null,
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
      'catalogs',
      new TableIndex({ columnNames: ['title'], name: 'idx_catalogs_title' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('catalogs', 'idx_catalogs_title');
    await queryRunner.dropTable('catalogs');
  }
}

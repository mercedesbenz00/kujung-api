import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class ManagementLawMigration1683861137792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'management_laws',
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
            comment: 'Management law title',
          },
          {
            name: 'summary',
            type: 'text',
            comment: 'Management law summary',
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
      'management_laws',
      new TableIndex({
        columnNames: ['title'],
        name: 'idx_management_laws_title',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('management_laws', 'idx_management_laws_title');
    await queryRunner.dropTable('management_laws');
  }
}

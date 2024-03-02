import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class NotificationMigration1683861137912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
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
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'content',
            type: 'longblob',
          },
          {
            name: 'top_fixed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'thumb_url',
            type: 'varchar',
            length: '2048',
            comment: 'Notification thumbnail url',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url_mobile',
            type: 'varchar',
            length: '2048',
            comment: 'Notification mobile thumbnail url',
            isNullable: true,
            default: null,
          },
          {
            name: 'like_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'view_count',
            type: 'int',
            default: 0,
            comment: 'view count',
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
      'notifications',
      new TableIndex({
        name: 'idx_notifications_title',
        columnNames: ['title'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('notifications', 'idx_notifications_title');
    await queryRunner.dropTable('notifications');
  }
}

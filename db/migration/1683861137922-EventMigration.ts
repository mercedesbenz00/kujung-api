import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class EventMigration1683861137922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'events',
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
            isNullable: true,
            default: null,
          },
          {
            name: 'start_at',
            type: 'datetime',
            comment: 'Start date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'end_at',
            type: 'datetime',
            comment: 'End date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url',
            type: 'varchar',
            length: '2048',
            isNullable: true,
            default: null,
          },
          {
            name: 'enabled',
            type: 'boolean',
            default: false,
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
      'events',
      new TableIndex({
        name: 'idx_events_title',
        columnNames: ['title'],
      }),
    );
    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'idx_events_start_at',
        columnNames: ['start_at'],
      }),
    );
    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'idx_events_end_at',
        columnNames: ['end_at'],
      }),
    );
    await queryRunner.createIndex(
      'events',
      new TableIndex({
        name: 'idx_events_enabled',
        columnNames: ['enabled'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('events', 'idx_events_title');
    await queryRunner.dropIndex('events', 'idx_events_start_at');
    await queryRunner.dropIndex('events', 'idx_events_end_at');
    await queryRunner.dropIndex('events', 'idx_events_enabled');
    await queryRunner.dropTable('events');
  }
}

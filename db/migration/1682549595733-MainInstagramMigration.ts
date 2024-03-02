import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class MainInstagramMigration1682549595733 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'main_instagrams',
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
            comment: 'Main instagram title',
          },
          {
            name: 'instagram_url',
            type: 'varchar(2048)',
            comment: 'instagram url',
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            comment: 'instagram thumb url',
            default: null,
            isNullable: true,
          },
          {
            name: 'enabled',
            type: 'bool',
            comment: 'Enable/disable flag',
            default: false,
          },
          {
            name: 'seq',
            type: 'int',
            comment: 'order sequence',
            unsigned: true,
            isNullable: true,
            default: null,
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

    await queryRunner.createIndex(
      'main_instagrams',
      new TableIndex({
        name: 'idx_main_instagrams_seq',
        columnNames: ['seq'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('main_instagrams', 'idx_main_instagrams_seq');
    await queryRunner.dropTable('main_instagrams');
  }
}

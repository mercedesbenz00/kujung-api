import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class MainConstructionCaseMigration1683861137962
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'main_construction_cases',
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
            comment: 'Main construction case title',
          },
          {
            name: 'url',
            type: 'varchar(2048)',
            comment: 'url',
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
      'main_construction_cases',
      new TableIndex({
        name: 'idx_main_construction_cases_seq',
        columnNames: ['seq'],
      }),
    );

    // tmp

    await queryRunner.addColumn(
      'main_youtubes',
      new TableColumn({
        name: 'seq',
        type: 'int',
        comment: 'order sequence',
        unsigned: true,
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'main_instagrams',
      new TableColumn({
        name: 'seq',
        type: 'int',
        comment: 'order sequence',
        unsigned: true,
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.createIndex(
      'main_youtubes',
      new TableIndex({
        name: 'idx_main_youtubes_seq',
        columnNames: ['seq'],
      }),
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
    await queryRunner.dropIndex(
      'main_construction_cases',
      'idx_main_construction_cases_seq',
    );
    await queryRunner.dropTable('main_construction_cases');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PopupMigration1683629138754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'popups',
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
            comment: 'popup title',
          },
          {
            name: 'target',
            type: 'tinyint',
            default: 0,
            comment: 'target, 0: current, 1: new, 2: no transition',
          },
          {
            name: 'priority',
            type: 'int',
            unsigned: true,
            default: 1,
            comment: 'display priority',
          },
          {
            name: 'url',
            type: 'varchar(2048)',
            comment: 'popup url',
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            default: null,
            isNullable: true,
            comment: 'popup pc image thumbnail url',
          },
          {
            name: 'thumb_url_mobile',
            type: 'varchar(2048)',
            default: null,
            isNullable: true,
            comment: 'popup mobile image thumbnail url',
          },
          {
            name: 'image_url',
            type: 'varchar(2048)',
            comment: 'popup image url for pc',
          },
          {
            name: 'image_url_mobile',
            type: 'varchar(2048)',
            comment: 'popup image url for mobile',
          },
          {
            name: 'enabled',
            type: 'bool',
            comment: 'enable/disable flag',
            default: true,
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
    await queryRunner.dropTable('popups');
  }
}

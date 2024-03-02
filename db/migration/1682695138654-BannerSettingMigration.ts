import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BannerSettingMigration1682695138654 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'banner_setting',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'banner_type',
            type: 'varchar',
            comment: 'Banner type. ex: main, smart-store etc',
            isUnique: true,
          },
          {
            name: 'interval',
            type: 'tinyint',
            default: 4,
            comment: 'slide transition interval seconds',
          },
          {
            name: 'auto_transition',
            type: 'bool',
            default: false,
            comment: 'slide auto transition flag',
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
    await queryRunner.dropTable('banner_setting');
  }
}

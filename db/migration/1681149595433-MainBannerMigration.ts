import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class MainBannerMigration1681149595433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'main_banners',
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
            comment: 'Main banner title',
          },
          {
            name: 'address',
            type: 'varchar',
            comment: 'Main banner address',
          },
          {
            name: 'target',
            type: 'tinyint',
            comment: 'target, 0: current, 1: new, 2: no transition',
          },
          {
            name: 'format',
            type: 'varchar',
            comment: 'Main banner format. {video, image}',
          },
          {
            name: 'video_url',
            type: 'varchar(2048)',
            comment: 'video url',
            default: null,
            isNullable: true,
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            comment: 'video thumb url',
            default: null,
            isNullable: true,
          },
          {
            name: 'thumb_url_mobile',
            comment: 'video thumb url for mobile',
            type: 'varchar(2048)',
            default: null,
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar(2048)',
            comment: 'image url',
            default: null,
            isNullable: true,
          },
          {
            name: 'image_url_mobile',
            type: 'varchar(2048)',
            comment: 'image url for mobile',
            default: null,
            isNullable: true,
          },
          {
            name: 'enabled',
            type: 'bool',
            comment: 'Enable/Disable flag',
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
    await queryRunner.dropTable('main_banners');
  }
}

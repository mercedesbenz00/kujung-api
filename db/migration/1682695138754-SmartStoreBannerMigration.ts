import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class SmartStoreBannerMigration1682695138754
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'smart_store_banners',
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
            comment: 'smart store banner title',
          },
          {
            name: 'address',
            type: 'varchar',
            comment: 'smart store banner url',
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            default: null,
            isNullable: true,
            comment: 'smart store pc image thumbnail url',
          },
          {
            name: 'thumb_url_mobile',
            type: 'varchar(2048)',
            default: null,
            isNullable: true,
            comment: 'smart store mobile image thumbnail url',
          },
          {
            name: 'image_url',
            type: 'varchar(2048)',
            comment: 'smart store image url for pc',
          },
          {
            name: 'image_url_mobile',
            type: 'varchar(2048)',
            comment: 'smart store image url for mobile',
          },
          {
            name: 'enabled',
            type: 'bool',
            comment: 'enable/disable flag',
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
    await queryRunner.dropTable('smart_store_banners');
  }
}

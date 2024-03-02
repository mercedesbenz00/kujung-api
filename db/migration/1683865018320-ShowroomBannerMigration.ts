import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ShowroomBannerMigration1683865018320
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'showroom_banners',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
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
            default: true,
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
    await queryRunner.dropTable('showroom_banners');
  }
}

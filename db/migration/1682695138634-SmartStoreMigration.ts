import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class SmartStoreMigration1682695138634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'smart_stores',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            comment: 'smart store product name',
          },
          {
            name: 'address',
            type: 'varchar(2048)',
            isNullable: true,
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            isNullable: true,
          },
          {
            name: 'display',
            type: 'bool',
            default: false,
            comment: 'display flag',
          },
          {
            name: 'recommended',
            type: 'bool',
            default: false,
            comment: 'recommended flag',
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
            comment: 'smart store product category',
          },
          {
            name: 'wish_count',
            type: 'int',
            default: 0,
            comment: 'wish count',
          },
          {
            name: 'like_count',
            type: 'int',
            default: 0,
            comment: 'like count',
          },
          {
            name: 'desc',
            type: 'text',
            comment: ' description',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('smart_stores');
  }
}

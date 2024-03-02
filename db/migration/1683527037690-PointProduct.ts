import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class PointProduct1683527037690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'point_products',
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
            comment: 'point product name',
          },
          {
            name: 'summary',
            type: 'text',
            comment: 'point product summary',
            isNullable: true,
            default: null,
          },
          {
            name: 'point',
            type: 'int',
            comment: 'product point',
            unsigned: true,
            default: 0,
          },
          {
            name: 'view_point',
            type: 'int',
            comment: 'product view point',
            unsigned: true,
            default: 0,
          },
          {
            name: 'desc',
            type: 'longblob',
            comment: 'point product desc',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            comment: 'point product thumbnail url',
            isNullable: true,
            default: null,
          },
          {
            name: 'is_bee',
            type: 'bool',
            comment: 'is_bee flag',
            default: false,
          },
          {
            name: 'seq',
            type: 'int',
            comment: 'product order sequence',
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
            type: 'datetime(3)',
            default: 'CURRENT_TIMESTAMP(3)',
          },
          {
            name: 'updated_at',
            type: 'datetime(3)',
            default: 'CURRENT_TIMESTAMP(3)',
            onUpdate: 'CURRENT_TIMESTAMP(3)',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'point_products',
      new TableIndex({
        name: 'idx_point_products_seq',
        columnNames: ['seq'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('point_products', 'idx_point_products_seq');
    await queryRunner.dropTable('point_products');
  }
}

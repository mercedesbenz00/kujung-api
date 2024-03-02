import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class PointProductOrder1683527037790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'point_product_orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'requester_id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'product_id',
            comment: 'point product id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'recipient_name',
            type: 'varchar',
            comment: 'recipient name',
          },
          {
            name: 'recipient_phone',
            type: 'varchar',
            comment: 'recipient phone',
          },
          {
            name: 'delivery_addr',
            type: 'varchar',
            comment: 'delivery address',
          },
          {
            name: 'delivery_addr_sub',
            type: 'varchar',
            comment: 'delivery sub address',
            default: null,
            isNullable: true,
          },
          {
            name: 'delivery_zonecode',
            type: 'varchar',
            comment: 'delivery 2nd sub address',
            default: null,
            isNullable: true,
          },
          {
            name: 'delivery_memo',
            type: 'varchar',
            comment: 'delivery memo',
            default: null,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar(20)',
            comment: 'delivery status',
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

    await queryRunner.createForeignKey(
      'point_product_orders',
      new TableForeignKey({
        columnNames: ['requester_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'point_product_orders',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'point_products',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'point_product_orders',
      new TableIndex({
        name: 'idx_point_product_orders_name',
        columnNames: ['recipient_name'],
      }),
    );
    await queryRunner.createIndex(
      'point_product_orders',
      new TableIndex({
        name: 'idx_point_product_orders_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('point_product_orders');
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('requester_id') !== -1,
    );
    const productForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_id') !== -1,
    );

    await queryRunner.dropForeignKey('point_product_orders', userForeignKey);
    await queryRunner.dropForeignKey('point_product_orders', productForeignKey);
    await queryRunner.dropIndex(
      'point_product_orders',
      'idx_point_product_orders_name',
    );
    await queryRunner.dropIndex(
      'point_product_orders',
      'idx_point_product_orders_status',
    );
    await queryRunner.dropTable('point_product_orders');
  }
}

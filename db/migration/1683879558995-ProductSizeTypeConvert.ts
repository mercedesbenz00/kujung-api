import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export class ProductSizeTypeConvert1683879558995 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // size_t
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'size_t_string',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.query(
      `UPDATE products SET size_t_string = CAST(size_t AS CHAR(255))`,
    );
    await queryRunner.dropColumn('products', 'size_t');
    await queryRunner.renameColumn('products', 'size_t_string', 'size_t');
    //size_w
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'size_w_string',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.query(
      `UPDATE products SET size_w_string = CAST(size_w AS CHAR(255))`,
    );
    await queryRunner.dropColumn('products', 'size_w');
    await queryRunner.renameColumn('products', 'size_w_string', 'size_w');

    //size_l
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'size_l_string',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.query(
      `UPDATE products SET size_l_string = CAST(size_l AS CHAR(255))`,
    );
    await queryRunner.dropColumn('products', 'size_l');
    await queryRunner.renameColumn('products', 'size_l_string', 'size_l');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'size_t_double',
        type: 'decimal',
        default: 0,
        scale: 2,
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'size_w_double',
        type: 'decimal',
        default: 0,
        scale: 2,
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'size_l_double',
        type: 'decimal',
        default: 0,
        scale: 2,
      }),
    );
    await queryRunner.query(
      `UPDATE products SET size_t_double = CAST(size_t AS double precision)`,
    );
    await queryRunner.query(
      `UPDATE products SET size_w_double = CAST(size_w AS double precision)`,
    );
    await queryRunner.query(
      `UPDATE products SET size_l_double = CAST(size_l AS double precision)`,
    );

    await queryRunner.dropColumn('products', 'size_t');
    await queryRunner.dropColumn('products', 'size_w');
    await queryRunner.dropColumn('products', 'size_l');

    await queryRunner.renameColumn('products', 'size_t_double', 'size_t');
    await queryRunner.renameColumn('products', 'size_w_double', 'size_w');
    await queryRunner.renameColumn('products', 'size_l_double', 'size_l');
  }
}

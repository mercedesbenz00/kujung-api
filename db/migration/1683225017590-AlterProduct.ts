import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class AlterProduct1683225017590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'recommended',
        comment: 'Recommended flag',
        type: 'bool',
        default: false,
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'top_fixed',
        comment: 'Top fixed flag',
        type: 'bool',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'recommended');
    await queryRunner.dropColumn('products', 'top_fixed');
  }
}

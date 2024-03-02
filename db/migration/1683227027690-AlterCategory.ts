import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class AlterCategory1683227027690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'categories_tree',
      new TableColumn({
        name: 'seq',
        comment: 'category display seq',
        type: 'int',
        unsigned: true,
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.createIndex(
      'categories_tree',
      new TableIndex({
        name: 'idx_categories_tree_seq',
        columnNames: ['seq'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('categories_tree', 'idx_categories_tree_seq');

    await queryRunner.dropColumn('categories_tree', 'seq');
  }
}

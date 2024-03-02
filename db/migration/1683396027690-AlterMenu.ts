import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class AlterMenu1683396027690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'menus_tree',
      new TableColumn({
        name: 'seq',
        comment: 'menu display seq',
        type: 'int',
        unsigned: true,
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.createIndex(
      'menus_tree',
      new TableIndex({
        name: 'idx_menus_tree_seq',
        columnNames: ['seq'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('menus_tree', 'idx_menus_tree_seq');

    await queryRunner.dropColumn('menus_tree', 'seq');
  }
}

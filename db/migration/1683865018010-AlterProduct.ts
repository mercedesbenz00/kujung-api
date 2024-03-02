import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';
export class Temp1683865017990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'seq',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'product sequence',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'family_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'family type code',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'view_point',
        type: 'int',
        default: 0,
        comment: 'product view point',
      }),
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_products_family_type_code_common_constants',
        columnNames: ['family_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.dropColumns('products', ['residence_type']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'products',
      'FK_products_family_type_code_common_constants',
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'residence_type',
        type: 'varchar',
        isNullable: true,
        comment: 'residency type',
      }),
    );
    await queryRunner.dropColumns('products', [
      'family_type_code',
      'view_point',
      'seq',
    ]);
  }
}

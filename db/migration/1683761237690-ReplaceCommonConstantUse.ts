import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class ReplaceCommonConstantUse1683761237690
  implements MigrationInterface
{
  private async onlineHouseUp(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('online_houses', 'idx_online_house_color');
    await queryRunner.dropIndex(
      'online_houses',
      'idx_online_house_family_type',
    );
    await queryRunner.dropIndex('online_houses', 'idx_online_house_style');
    await queryRunner.dropIndex('online_houses', 'idx_online_house_area_min');

    await queryRunner.dropColumn('online_houses', 'color');
    await queryRunner.dropColumn('online_houses', 'family_type');
    await queryRunner.dropColumn('online_houses', 'style');
    await queryRunner.dropColumn('online_houses', 'area_min');
    await queryRunner.dropColumn('online_houses', 'area_max');

    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'color_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'color code',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'family_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'family type code',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'house_style_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house style code',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'house_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house type code',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'area_space_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'area space code',
      }),
    );

    await queryRunner.createForeignKey(
      'online_houses',
      new TableForeignKey({
        name: 'FK_online_houses_color_code_common_constants',
        columnNames: ['color_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'online_houses',
      new TableForeignKey({
        name: 'FK_online_houses_family_type_code_common_constants',
        columnNames: ['family_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'online_houses',
      new TableForeignKey({
        name: 'FK_online_houses_house_style_code_common_constants',
        columnNames: ['house_style_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'online_houses',
      new TableForeignKey({
        name: 'FK_online_houses_house_type_code_common_constants',
        columnNames: ['house_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'online_houses',
      new TableForeignKey({
        name: 'FK_online_houses_area_space_code_common_constants',
        columnNames: ['area_space_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }
  private async expertHouseUp(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_color');
    await queryRunner.dropIndex(
      'expert_houses',
      'idx_expert_house_family_type',
    );
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_style');
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_area_min');

    await queryRunner.dropColumn('expert_houses', 'color');
    await queryRunner.dropColumn('expert_houses', 'family_type');
    await queryRunner.dropColumn('expert_houses', 'style');
    await queryRunner.dropColumn('expert_houses', 'area_min');
    await queryRunner.dropColumn('expert_houses', 'area_max');

    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'color_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'color code',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'family_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'family type code',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'house_style_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house style code',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'house_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house type code',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'area_space_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'area space code',
      }),
    );

    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_color_code_common_constants',
        columnNames: ['color_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_family_type_code_common_constants',
        columnNames: ['family_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_house_style_code_common_constants',
        columnNames: ['house_style_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_house_type_code_common_constants',
        columnNames: ['house_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_area_space_code_common_constants',
        columnNames: ['area_space_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }
  private async detailedQuotationUp(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_house_style',
    );

    await queryRunner.dropColumn('detailed_quotations', 'house_style');
    await queryRunner.dropColumn('detailed_quotations', 'area_min');
    await queryRunner.dropColumn('detailed_quotations', 'area_max');
    await queryRunner.addColumn(
      'detailed_quotations',
      new TableColumn({
        name: 'house_style_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house style code',
      }),
    );
    await queryRunner.addColumn(
      'detailed_quotations',
      new TableColumn({
        name: 'area_space_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'area space code',
      }),
    );
    await queryRunner.createForeignKey(
      'detailed_quotations',
      new TableForeignKey({
        name: 'FK_detailed_quotations_house_style_code_common_constants',
        columnNames: ['house_style_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'detailed_quotations',
      new TableForeignKey({
        name: 'FK_detailed_quotations_area_space_code_common_constants',
        columnNames: ['area_space_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  private async productUp(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('products', 'style');
    await queryRunner.dropColumn('products', 'color');
    await queryRunner.dropColumn('products', 'area_min');
    await queryRunner.dropColumn('products', 'area_max');

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'color_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'color code',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'house_style_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house style code',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'area_space_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'area space code',
      }),
    );

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'house_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house type code',
      }),
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_products_house_type_code_common_constants',
        columnNames: ['house_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_products_color_code_common_constants',
        columnNames: ['color_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_products_house_style_code_common_constants',
        columnNames: ['house_style_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'FK_products_area_space_code_common_constants',
        columnNames: ['area_space_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  private async onlineHouseDown(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'online_houses',
      'FK_online_houses_color_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'online_houses',
      'FK_online_houses_family_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'online_houses',
      'FK_online_houses_house_style_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'online_houses',
      'FK_online_houses_house_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'online_houses',
      'FK_online_houses_area_space_code_common_constants',
    );

    await queryRunner.dropColumns('online_houses', [
      'color_code',
      'family_type_code',
      'house_style_code',
      'house_type_code',
      'area_space_code',
    ]);

    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'color',
        type: 'varchar',
        isNullable: true,
        comment: 'online house color',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'family_type',
        type: 'varchar',
        isNullable: true,
        comment: 'family type',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'style',
        type: 'varchar',
        isNullable: true,
        comment: 'online house style',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'area_min',
        type: 'tinyint',
        isNullable: true,
        comment: 'area space min value',
      }),
    );
    await queryRunner.addColumn(
      'online_houses',
      new TableColumn({
        name: 'area_max',
        type: 'tinyint',
        isNullable: true,
        comment: 'area space max value',
      }),
    );
    await queryRunner.createIndex(
      'online_houses',
      new TableIndex({
        name: 'idx_online_house_color',
        columnNames: ['color'],
      }),
    );

    await queryRunner.createIndex(
      'online_houses',
      new TableIndex({
        name: 'idx_online_house_family_type',
        columnNames: ['family_type'],
      }),
    );

    await queryRunner.createIndex(
      'online_houses',
      new TableIndex({
        name: 'idx_online_house_style',
        columnNames: ['style'],
      }),
    );

    await queryRunner.createIndex(
      'online_houses',
      new TableIndex({
        name: 'idx_online_house_area_min',
        columnNames: ['area_min'],
      }),
    );
  }
  private async expertHouseDown(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_color_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_family_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_house_style_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_house_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_area_space_code_common_constants',
    );

    await queryRunner.dropColumns('expert_houses', [
      'color_code',
      'family_type_code',
      'house_style_code',
      'area_space_code',
      'house_type_code',
    ]);

    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'color',
        type: 'varchar',
        isNullable: true,
        comment: 'expert house color',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'family_type',
        type: 'varchar',
        isNullable: true,
        comment: 'family type',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'style',
        type: 'varchar',
        isNullable: true,
        comment: 'expert house style',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'area_min',
        type: 'tinyint',
        isNullable: true,
        comment: 'area space min value',
      }),
    );
    await queryRunner.addColumn(
      'expert_houses',
      new TableColumn({
        name: 'area_max',
        type: 'tinyint',
        isNullable: true,
        comment: 'area space max value',
      }),
    );
    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_color',
        columnNames: ['color'],
      }),
    );

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_family_type',
        columnNames: ['family_type'],
      }),
    );

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_style',
        columnNames: ['style'],
      }),
    );

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_area_min',
        columnNames: ['area_min'],
      }),
    );
  }
  private async detailedQuotationDown(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'detailed_quotations',
      'FK_detailed_quotations_house_style_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'detailed_quotations',
      'FK_detailed_quotations_area_space_code_common_constants',
    );

    await queryRunner.dropColumns('detailed_quotations', [
      'house_style_code',
      'area_space_code',
    ]);

    await queryRunner.addColumn(
      'detailed_quotations',
      new TableColumn({
        name: 'house_style',
        type: 'varchar',
        isNullable: true,
        comment: 'house style',
      }),
    );

    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_house_style',
        columnNames: ['house_style'],
      }),
    );
  }
  private async productDown(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'products',
      'FK_products_house_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'products',
      'FK_products_color_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'products',
      'FK_products_house_style_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'products',
      'FK_products_area_space_code_common_constants',
    );

    await queryRunner.dropColumns('products', [
      'color_code',
      'house_style_code',
      'area_space_code',
    ]);

    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'color',
        type: 'varchar',
        isNullable: true,
        comment: 'house color',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'style',
        type: 'varchar',
        isNullable: true,
        comment: 'house style',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'area_min',
        type: 'tinyint',
        isNullable: true,
        comment: 'area space min value',
      }),
    );
    await queryRunner.addColumn(
      'products',
      new TableColumn({
        name: 'area_max',
        type: 'tinyint',
        isNullable: true,
        comment: 'area space max value',
      }),
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.onlineHouseUp(queryRunner);
    await this.expertHouseUp(queryRunner);
    await this.detailedQuotationUp(queryRunner);
    await this.productUp(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.onlineHouseDown(queryRunner);
    await this.expertHouseDown(queryRunner);
    await this.detailedQuotationDown(queryRunner);
    await this.productDown(queryRunner);
  }
}

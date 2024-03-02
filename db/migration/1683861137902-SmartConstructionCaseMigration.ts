import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class SmartConstructionCaseMigration1683861137902
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'smart_construction_cases',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'area_space_code',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'residence_type',
            type: 'varchar',
            isNullable: true,
            comment: 'residency type',
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'title',
            type: 'varchar',
            comment: 'title',
          },
          {
            name: 'summary',
            type: 'text',
            isNullable: true,
            comment: 'summary',
          },
          {
            name: 'url',
            type: 'varchar',
            length: '2048',
            isNullable: true,
            default: null,
            comment: 'url',
          },
          {
            name: 'thumb_url',
            type: 'varchar',
            length: '2048',
            isNullable: true,
            default: null,
            comment: 'thumb url',
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

    await queryRunner.createIndex(
      'smart_construction_cases',
      new TableIndex({
        columnNames: ['title'],
        name: 'idx_smart_construction_cases_title',
      }),
    );

    await queryRunner.createForeignKey(
      'smart_construction_cases',
      new TableForeignKey({
        columnNames: ['area_space_code'],
        referencedTableName: 'common_constants',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
        name: 'FK_smart_construction_cases_area_space_code_common_constants',
      }),
    );

    await queryRunner.createForeignKey(
      'smart_construction_cases',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
        name: 'FK_smart_construction_cases_product_id_products',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'smart_construction_case_tags',
        columns: [
          {
            name: 'smart_construction_case_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'tag_id',
            type: 'int',
            isNullable: false,
          },
        ],
        indices: [
          {
            columnNames: ['smart_construction_case_id'],
            name: 'IDX_smart_construction_case_tags_smart_construction_case_id',
          },
          {
            columnNames: ['tag_id'],
            name: 'IDX_smart_construction_case_tags_tag_id',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['smart_construction_case_id'],
            referencedTableName: 'smart_construction_cases',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
            name: 'FK_smart_construction_case_tags_333',
          },
          {
            columnNames: ['tag_id'],
            referencedTableName: 'tags',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION',
            name: 'FK_smart_construction_case_tags_tag_id_tags',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'smart_construction_case_tags',
      new TableIndex({
        name: 'UQ_smart_construction_case_id_tag_id',
        columnNames: ['smart_construction_case_id', 'tag_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'smart_construction_case_tags',
      'UQ_smart_construction_case_id_tag_id',
    );
    await queryRunner.dropIndex(
      'smart_construction_case_tags',
      'IDX_smart_construction_case_tags_smart_construction_case_id',
    );
    await queryRunner.dropIndex(
      'smart_construction_case_tags',
      'IDX_smart_construction_case_tags_tag_id',
    );

    // Drop the foreign key relationships
    await queryRunner.dropForeignKey(
      'smart_construction_case_tags',
      'FK_smart_construction_case_tags_333',
    );
    await queryRunner.dropForeignKey(
      'smart_construction_case_tags',
      'FK_smart_construction_case_tags_tag_id_tags',
    );

    await queryRunner.dropTable('smart_construction_case_tags');
    await queryRunner.dropForeignKey(
      'smart_construction_cases',
      'FK_smart_construction_cases_area_space_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'smart_construction_cases',
      'FK_smart_construction_cases_product_id_products',
    );
    await queryRunner.dropIndex(
      'smart_construction_cases',
      'idx_smart_construction_cases_title',
    );
    await queryRunner.dropTable('smart_construction_cases');
  }
}

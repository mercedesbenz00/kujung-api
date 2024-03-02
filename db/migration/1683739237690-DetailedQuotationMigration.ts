import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class DetailedQuotationMigration1683739237690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'detailed_quotations',
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
            comment: 'User name',
          },
          {
            name: 'phone',
            type: 'varchar',
            comment: 'User phone',
          },
          {
            name: 'addr',
            type: 'varchar(2048)',
            isNullable: true,
            comment: 'User address',
          },
          {
            name: 'house_style',
            type: 'varchar',
            comment: 'house style',
          },
          {
            name: 'remark',
            type: 'text',
            isNullable: true,
            comment: 'remark',
          },
          {
            name: 'house_style_text',
            type: 'text',
            isNullable: true,
            comment: 'House style text',
          },
          {
            name: 'area_space_text',
            type: 'text',
            isNullable: true,
            comment: 'Area space text',
          },
          {
            name: 'area_min',
            type: 'tinyint',
            isNullable: true,
            comment: 'area space min value',
          },
          {
            name: 'area_max',
            type: 'tinyint',
            isNullable: true,
            comment: 'area space max value',
          },
          {
            name: 'living_room_count',
            type: 'int',
            default: 0,
            comment: 'living room count',
          },
          {
            name: 'kitchen_count',
            type: 'int',
            default: 0,
            comment: 'Kitchen count',
          },
          {
            name: 'room_count',
            type: 'int',
            default: 0,
            comment: 'room count',
          },
          {
            name: 'product_id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'category_id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'int',
            default: 0,
            comment: 'status. 0: waiting, 1: approved, 2: rejected',
          },
          {
            name: 'requested_by',
            type: 'int',
            isNullable: true,
            comment: 'user id who requested',
          },
          {
            name: 'managed_by',
            type: 'int',
            isNullable: true,
            comment: 'admin id who updated status',
          },
          {
            name: 'requested_at',
            type: 'datetime(6)',
            isNullable: true,
            default: null,
            comment: 'requested date time',
          },
          {
            name: 'rejected_at',
            type: 'datetime(6)',
            isNullable: true,
            default: null,
            comment: 'rejected date time',
          },
          {
            name: 'approved_at',
            type: 'datetime(6)',
            isNullable: true,
            default: null,
            comment: 'approved date time',
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
          // Add more columns as needed
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Add indexes
    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_house_style',
        columnNames: ['house_style'],
      }),
    );

    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_requested_at',
        columnNames: ['requested_at'],
      }),
    );

    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_rejected_at',
        columnNames: ['rejected_at'],
      }),
    );

    await queryRunner.createIndex(
      'detailed_quotations',
      new TableIndex({
        name: 'idx_detailed_quotation_approved_at',
        columnNames: ['approved_at'],
      }),
    );

    // Create the foreign key relationship with "products" table
    await queryRunner.createForeignKey(
      'detailed_quotations',
      new TableForeignKey({
        name: 'FK_detailed_quotations_product_id_products',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "products" table
    await queryRunner.createForeignKey(
      'detailed_quotations',
      new TableForeignKey({
        name: 'FK_detailed_quotations_category_id',
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories_tree',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "users" table
    await queryRunner.createForeignKey(
      'detailed_quotations',
      new TableForeignKey({
        name: 'FK_detailed_quotations_requested_by_users',
        columnNames: ['requested_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "admins" table
    await queryRunner.createForeignKey(
      'detailed_quotations',
      new TableForeignKey({
        name: 'FK_detailed_quotations_managed_by_admins',
        columnNames: ['managed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationships
    await queryRunner.dropForeignKey(
      'detailed_quotations',
      'FK_detailed_quotations_product_id_products',
    );
    await queryRunner.dropForeignKey(
      'detailed_quotations',
      'FK_detailed_quotations_category_id',
    );

    await queryRunner.dropForeignKey(
      'detailed_quotations',
      'FK_detailed_quotations_requested_by_users',
    );
    await queryRunner.dropForeignKey(
      'detailed_quotations',
      'FK_detailed_quotations_managed_by_admins',
    );

    // Drop the indexes

    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_name',
    );
    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_house_style',
    );
    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_status',
    );
    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_requested_at',
    );
    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_rejected_at',
    );
    await queryRunner.dropIndex(
      'detailed_quotations',
      'idx_detailed_quotation_approved_at',
    );

    // Drop the "detailed_quotations" table
    await queryRunner.dropTable('detailed_quotations');
  }
}

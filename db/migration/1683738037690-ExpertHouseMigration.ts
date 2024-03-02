import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class ExpertHouseMigration1683738037690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'expert_houses',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'color',
            type: 'varchar',
            isNullable: true,
            comment: 'expert house color',
          },
          {
            name: 'family_type',
            type: 'varchar',
            isNullable: true,
            comment: 'family type',
          },
          {
            name: 'style',
            type: 'varchar',
            isNullable: true,
            comment: 'expert house style',
          },
          {
            name: 'reason',
            type: 'text',
            isNullable: true,
            comment: 'status change reason',
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
            name: 'main_display',
            type: 'boolean',
            default: false,
            comment: 'Main display flag',
          },
          {
            name: 'is_this_month',
            type: 'boolean',
            default: false,
            comment: 'flag whether it is this month house',
          },
          {
            name: 'this_month_order',
            type: 'int',
            isNullable: true,
            default: null,
            comment: 'this month order',
          },
          {
            name: 'wish_count',
            type: 'int',
            default: 0,
            comment: 'wish count',
          },
          {
            name: 'like_count',
            type: 'int',
            default: 0,
            comment: 'like count',
          },
          {
            name: 'view_count',
            type: 'int',
            default: 0,
            comment: 'view count',
          },
          {
            name: 'view_point',
            type: 'int',
            default: 0,
            comment: 'view point',
          },
          {
            name: 'product_id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'label_id',
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
            name: 'title',
            type: 'varchar',
            comment: 'expert house title',
            isNullable: true,
            default: null,
          },
          {
            name: 'content',
            type: 'longblob',
            comment: 'content',
            isNullable: true,
            default: null,
          },
          {
            name: 'image_url',
            type: 'varchar(2048)',
            comment: 'expert house image url',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url',
            type: 'varchar(2048)',
            comment: 'expert house thumb url',
            isNullable: true,
            default: null,
          },
          {
            name: 'building_addr',
            type: 'varchar(2048)',
            comment: 'expert house building address',
            isNullable: true,
            default: null,
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

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_requested_at',
        columnNames: ['requested_at'],
      }),
    );

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_rejected_at',
        columnNames: ['rejected_at'],
      }),
    );

    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_approved_at',
        columnNames: ['approved_at'],
      }),
    );
    await queryRunner.createIndex(
      'expert_houses',
      new TableIndex({
        name: 'idx_expert_house_is_this_month',
        columnNames: ['is_this_month'],
      }),
    );

    // Create the foreign key relationship with "products" table
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_product_id_products',
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "labels" table
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_label_id_labels',
        columnNames: ['label_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'labels',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "users" table
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_requested_by_users',
        columnNames: ['requested_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "admins" table
    await queryRunner.createForeignKey(
      'expert_houses',
      new TableForeignKey({
        name: 'FK_expert_houses_managed_by_admins',
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
      'expert_houses',
      'FK_expert_houses_product_id_products',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_label_id_labels',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_requested_by_users',
    );
    await queryRunner.dropForeignKey(
      'expert_houses',
      'FK_expert_houses_managed_by_admins',
    );

    // Drop the indexes
    await queryRunner.dropIndex(
      'expert_houses',
      'idx_expert_house_is_this_month',
    );
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_color');
    await queryRunner.dropIndex(
      'expert_houses',
      'idx_expert_house_family_type',
    );
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_style');
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_area_min');
    await queryRunner.dropIndex('expert_houses', 'idx_expert_house_status');
    await queryRunner.dropIndex(
      'expert_houses',
      'idx_expert_house_requested_at',
    );
    await queryRunner.dropIndex(
      'expert_houses',
      'idx_expert_house_rejected_at',
    );
    await queryRunner.dropIndex(
      'expert_houses',
      'idx_expert_house_approved_at',
    );

    // Drop the "expert_houses" table
    await queryRunner.dropTable('expert_houses');
  }
}

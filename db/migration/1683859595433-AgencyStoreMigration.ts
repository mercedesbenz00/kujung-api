import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AgencyStoreMigration1683859595433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'agency_stores',
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
            comment: 'Agency store name',
          },
          {
            name: 'addr',
            type: 'varchar',
            comment: 'Agency store address',
          },
          {
            name: 'addr_sub',
            type: 'varchar',
            comment: 'Agency store sub address',
            isNullable: true,
            default: null,
          },
          {
            name: 'zonecode',
            type: 'varchar',
            comment: 'Agency store 2nd sub address',
            isNullable: true,
            default: null,
          },
          {
            name: 'area_code',
            type: 'int',
            isNullable: true,
            default: null,
            comment: 'area code',
          },
          {
            name: 'phone',
            type: 'varchar',
            comment: 'Phone number',
          },
          {
            name: 'feature',
            type: 'text',
            isNullable: true,
            default: null,
            comment: 'Feature',
          },
          {
            name: 'is_gold',
            type: 'boolean',
            comment: 'Gold flag',
            default: false,
          },
          {
            name: 'opening_hours',
            type: 'varchar',
            length: '2048',
            comment: 'Opening hours',
          },
          {
            name: 'priority',
            type: 'int',
            isNullable: true,
            default: null,
            comment: 'Priority order',
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '2048',
            isNullable: true,
            default: null,
            comment: 'Image URL',
          },
          {
            name: 'image_url_mobile',
            type: 'varchar',
            length: '2048',
            isNullable: true,
            default: null,
            comment: 'Image URL for mobile',
          },
          {
            name: 'lng',
            type: 'float',
            isNullable: true,
            comment: 'longitude value',
          },
          {
            name: 'lat',
            type: 'float',
            isNullable: true,
            comment: 'latitude value',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'agency_stores',
      new TableForeignKey({
        columnNames: ['area_code'],
        referencedTableName: 'common_constants',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createIndex(
      'agency_stores',
      new TableIndex({ columnNames: ['name'], name: 'idx_agency_stores_name' }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('agency_stores');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('area_code') !== -1,
    );
    await queryRunner.dropForeignKey('agency_stores', foreignKey);
    await queryRunner.dropIndex('agency_stores', 'idx_agency_stores_name');
    await queryRunner.dropTable('agency_stores');
  }
}

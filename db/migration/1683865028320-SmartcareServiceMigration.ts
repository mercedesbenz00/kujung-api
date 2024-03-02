import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class SmartcareServiceMigration1683865028320
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'smartcare_services',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'requester_id',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            comment: 'Smartcare requester name',
          },
          {
            name: 'addr',
            type: 'varchar',
            comment: 'Smartcare service address',
          },
          {
            name: 'addr_sub',
            type: 'varchar',
            comment: 'Smartcare service sub address',
            isNullable: true,
            default: null,
          },
          {
            name: 'zonecode',
            type: 'varchar',
            comment: 'Smartcare service 2nd sub address',
            isNullable: true,
            default: null,
          },
          {
            name: 'phone',
            type: 'varchar',
            comment: 'Phone number',
            isNullable: true,
            default: null,
          },
          {
            name: 'know_from',
            type: 'varchar',
            isNullable: true,
            default: null,
            comment: 'Smartcare service known from',
          },
          {
            name: 'desired_services',
            type: 'varchar',
            comment: 'Desired services',
            isNullable: true,
            default: null,
          },
          {
            name: 'current_floor',
            type: 'varchar',
            comment: 'Current floor',
            isNullable: true,
            default: null,
          },
          {
            name: 'area_range',
            type: 'varchar',
            comment: 'Area range',
            isNullable: true,
            default: null,
          },
          {
            name: 'contact_time',
            type: 'varchar',
            comment: 'Contact time',
            isNullable: true,
            default: null,
          },
          {
            name: 'product_name',
            type: 'varchar',
            comment: 'Product name',
            isNullable: true,
            default: null,
          },
          {
            name: 'special_note',
            type: 'text',
            isNullable: true,
            default: null,
            comment: 'special note',
          },
          {
            name: 'status',
            type: 'tinyint',
            isNullable: true,
            default: 1,
            unsigned: true,
            comment: 'process status',
          },
          {
            name: 'quote_url',
            type: 'varchar',
            length: '2048',
            isNullable: true,
            default: null,
            comment: 'quote url',
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
      'smartcare_services',
      new TableForeignKey({
        columnNames: ['requester_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createIndex(
      'smartcare_services',
      new TableIndex({
        columnNames: ['status'],
        name: 'idx_smartcare_services_status',
      }),
    );

    await queryRunner.createIndex(
      'smartcare_services',
      new TableIndex({
        columnNames: ['name'],
        name: 'idx_smartcare_services_name',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('smartcare_services');
    const userForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('requester_id') !== -1,
    );
    await queryRunner.dropForeignKey('smartcare_services', userForeignKey);
    await queryRunner.dropIndex(
      'smartcare_services',
      'idx_smartcare_services_name',
    );
    await queryRunner.dropIndex(
      'smartcare_services',
      'idx_smartcare_services_status',
    );
    await queryRunner.dropTable('smartcare_services');
  }
}

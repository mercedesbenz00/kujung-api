import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class SmartcareServiceMemoMigration1683879537690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'smartcare_service_memo',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'content',
            type: 'text',
            comment: 'memo content',
            isNullable: true,
            default: null,
          },
          {
            name: 'smartcare_service_id',
            type: 'int',
            default: null,
            isNullable: true,
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
            name: 'created_by',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
            default: null,
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'smartcare_service_memo',
      new TableForeignKey({
        columnNames: ['smartcare_service_id'],
        referencedTableName: 'smartcare_services',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'smartcare_service_memo',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'smartcare_service_memo',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('smartcare_service_memo');
    const createdByForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('created_by') !== -1,
    );
    const updatedByForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('updated_by') !== -1,
    );

    await queryRunner.dropForeignKey(
      'smartcare_service_memo',
      createdByForeignKey,
    );
    await queryRunner.dropForeignKey(
      'smartcare_service_memo',
      updatedByForeignKey,
    );
    await queryRunner.dropTable('smartcare_service_memo');
  }
}

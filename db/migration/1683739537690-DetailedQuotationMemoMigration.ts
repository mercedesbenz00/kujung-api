import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class DetailedQuotationMemoMigration1683739537690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'detailed_quotation_memo',
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
            name: 'detailed_quotation_id',
            type: 'int',
            default: null,
            isNullable: true,
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
      'detailed_quotation_memo',
      new TableForeignKey({
        columnNames: ['detailed_quotation_id'],
        referencedTableName: 'detailed_quotations',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'detailed_quotation_memo',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'detailed_quotation_memo',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('detailed_quotation_memo');
    // const userForeignKey = table.foreignKeys.find(
    //   (fk) => fk.columnNames.indexOf('user_id') !== -1,
    // );
    const createdByForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('created_by') !== -1,
    );
    const updatedByForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('updated_by') !== -1,
    );

    // await queryRunner.dropForeignKey('detailed_quotation_memo', userForeignKey);
    await queryRunner.dropForeignKey(
      'detailed_quotation_memo',
      createdByForeignKey,
    );
    await queryRunner.dropForeignKey(
      'detailed_quotation_memo',
      updatedByForeignKey,
    );
    await queryRunner.dropTable('detailed_quotation_memo');
  }
}

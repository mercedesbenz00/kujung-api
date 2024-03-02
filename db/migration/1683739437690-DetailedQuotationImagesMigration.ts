import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class DetailedQuotationImagesMigration1683739437690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "detailed_quotation_images" table
    await queryRunner.createTable(
      new Table({
        name: 'detailed_quotation_images',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '2048',
          },
          {
            name: 'detailed_quotation_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "detailed_quotations" table
    await queryRunner.createForeignKey(
      'detailed_quotation_images',
      new TableForeignKey({
        columnNames: ['detailed_quotation_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'detailed_quotations',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('detailed_quotation_images');
    const quotationForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('detailed_quotation_id') !== -1,
    );

    await queryRunner.dropForeignKey(
      'detailed_quotation_memo',
      quotationForeignKey,
    );

    // Drop the "detailed_quotation_images" table
    await queryRunner.dropTable('detailed_quotation_images');
  }
}

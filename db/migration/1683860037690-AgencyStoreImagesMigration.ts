import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AgencyStoreImagesMigration1683860037690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "agency_store_images" table
    await queryRunner.createTable(
      new Table({
        name: 'agency_store_images',
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
            name: 'agency_store_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "agency_stores" table
    await queryRunner.createForeignKey(
      'agency_store_images',
      new TableForeignKey({
        name: 'FK_agency_store_images_agency_store_id_agency_stores',
        columnNames: ['agency_store_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'agency_stores',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationship
    await queryRunner.dropForeignKey(
      'agency_store_images',
      'FK_agency_store_images_agency_store_id_agency_stores',
    );

    // Drop the "agency_store_images" table
    await queryRunner.dropTable('agency_store_images');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class SmartcareServiceImagesMigration1683865038320
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "smartcare_service_images" table
    await queryRunner.createTable(
      new Table({
        name: 'smartcare_service_images',
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
            name: 'smartcare_service_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "smartcare_services" table
    await queryRunner.createForeignKey(
      'smartcare_service_images',
      new TableForeignKey({
        name: 'FK_smartcare_images_smartcare_service_id_smartcare_services',
        columnNames: ['smartcare_service_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'smartcare_services',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationship
    await queryRunner.dropForeignKey(
      'smartcare_service_images',
      'FK_smartcare_images_smartcare_service_id_smartcare_services',
    );

    // Drop the "smartcare_service_images" table
    await queryRunner.dropTable('smartcare_service_images');
  }
}

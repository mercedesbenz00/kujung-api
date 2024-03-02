import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class OnlineHouseImagesMigration1683729037690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "online_house_images" table
    await queryRunner.createTable(
      new Table({
        name: 'online_house_images',
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
            name: 'online_house_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "online_houses" table
    await queryRunner.createForeignKey(
      'online_house_images',
      new TableForeignKey({
        name: 'FK_online_house_images_online_house_id_online_houses',
        columnNames: ['online_house_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'online_houses',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationship
    await queryRunner.dropForeignKey(
      'online_house_images',
      'FK_online_house_images_online_house_id_online_houses',
    );

    // Drop the "online_house_images" table
    await queryRunner.dropTable('online_house_images');
  }
}

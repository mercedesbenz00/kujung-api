import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class OnlineHouseTagsMigration1683729137690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "online_house_tags" table
    await queryRunner.createTable(
      new Table({
        name: 'online_house_tags',
        columns: [
          {
            name: 'online_house_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'tag_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "online_houses" table
    await queryRunner.createForeignKey(
      'online_house_tags',
      new TableForeignKey({
        name: 'FK_online_house_tags_online_house_id_online_houses',
        columnNames: ['online_house_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'online_houses',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "tags" table
    await queryRunner.createForeignKey(
      'online_house_tags',
      new TableForeignKey({
        name: 'FK_online_house_tags_tag_id_tags',
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    // Add unique constraint for the pair (online_house_id, tag_id)
    await queryRunner.createIndex(
      'online_house_tags',
      new TableIndex({
        name: 'UQ_online_house_id_tag_id',
        columnNames: ['online_house_id', 'tag_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint
    await queryRunner.dropIndex(
      'online_house_tags',
      'UQ_online_house_id_tag_id',
    );

    // Drop the foreign key relationships
    await queryRunner.dropForeignKey(
      'online_house_tags',
      'FK_online_house_tags_online_house_id_online_houses',
    );
    await queryRunner.dropForeignKey(
      'online_house_tags',
      'FK_online_house_tags_tag_id_tags',
    );

    // Drop the "online_house_tags" table
    await queryRunner.dropTable('online_house_tags');
  }
}

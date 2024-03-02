import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class ExpertHouseTagsMigration1683739137690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "expert_house_tags" table
    await queryRunner.createTable(
      new Table({
        name: 'expert_house_tags',
        columns: [
          {
            name: 'expert_house_id',
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

    // Create the foreign key relationship with "expert_houses" table
    await queryRunner.createForeignKey(
      'expert_house_tags',
      new TableForeignKey({
        name: 'FK_expert_house_tags_expert_house_id_expert_houses',
        columnNames: ['expert_house_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'expert_houses',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "tags" table
    await queryRunner.createForeignKey(
      'expert_house_tags',
      new TableForeignKey({
        name: 'FK_expert_house_tags_tag_id_tags',
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    // Add unique constraint for the pair (expert_house_id, tag_id)
    await queryRunner.createIndex(
      'expert_house_tags',
      new TableIndex({
        name: 'UQ_expert_house_id_tag_id',
        columnNames: ['expert_house_id', 'tag_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint
    await queryRunner.dropIndex(
      'expert_house_tags',
      'UQ_expert_house_id_tag_id',
    );

    // Drop the foreign key relationships
    await queryRunner.dropForeignKey(
      'expert_house_tags',
      'FK_expert_house_tags_expert_house_id_expert_houses',
    );
    await queryRunner.dropForeignKey(
      'expert_house_tags',
      'FK_expert_house_tags_tag_id_tags',
    );

    // Drop the "expert_house_tags" table
    await queryRunner.dropTable('expert_house_tags');
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
export class SearchKeywordTyposMigration1683866137690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "search_keyword_typos" table
    await queryRunner.createTable(
      new Table({
        name: 'search_keyword_typos',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'typos',
            type: 'varchar',
            length: '2048',
          },
          {
            name: 'search_keyword_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "search_keywords" table
    await queryRunner.createForeignKey(
      'search_keyword_typos',
      new TableForeignKey({
        name: 'FK_search_keyword_typos_search_keyword_id_search_keywords',
        columnNames: ['search_keyword_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'search_keywords',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationship
    await queryRunner.dropForeignKey(
      'search_keyword_typos',
      'FK_search_keyword_typos_search_keyword_id_search_keywords',
    );

    // Drop the "search_keyword_typos" table
    await queryRunner.dropTable('search_keyword_typos');
  }
}

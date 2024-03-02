import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class PortfolioImagesMigration1683861137690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "portfolio_images" table
    await queryRunner.createTable(
      new Table({
        name: 'portfolio_images',
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
            name: 'portfolio_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "portfolios" table
    await queryRunner.createForeignKey(
      'portfolio_images',
      new TableForeignKey({
        name: 'FK_portfolio_images_portfolio_id_portfolios',
        columnNames: ['portfolio_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'portfolios',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationship
    await queryRunner.dropForeignKey(
      'portfolio_images',
      'FK_portfolio_images_portfolio_id_portfolios',
    );

    // Drop the "portfolio_images" table
    await queryRunner.dropTable('portfolio_images');
  }
}

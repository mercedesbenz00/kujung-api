import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ProductPopularityMigration1683879547690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_popularity',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'this_month_count',
            type: 'int',
            default: 0,
            comment: 'product click count in this month',
          },
          {
            name: 'prev_month_count',
            type: 'int',
            default: 0,
            comment: 'product click count in prev month',
          },
          {
            name: 'this_month_rank',
            type: 'int',
            default: 0,
            comment: 'product rank in this month',
          },
          {
            name: 'prev_month_rank',
            type: 'int',
            default: 0,
            comment: 'product rank in prev month',
          },
          {
            name: 'popularity_point',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            comment: 'popularity point',
          },
          {
            name: 'entity_id',
            type: 'int',
            isNullable: true,
            isUnique: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true, // indicates that this table is created only if it doesn't exist yet
    );

    await queryRunner.createForeignKey(
      'product_popularity',
      new TableForeignKey({
        name: 'FK_product_popularity_entity_id',
        columnNames: ['entity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'product_popularity',
      'FK_product_popularity_entity_id',
    );
    await queryRunner.dropTable('product_popularity', true);
  }
}

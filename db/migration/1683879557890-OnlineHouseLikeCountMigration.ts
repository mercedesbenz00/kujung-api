import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class OnlineHouseLikeCountMigration1683879557890
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'online_house_like_count',
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
            comment: 'online_house like count in this month',
          },
          {
            name: 'prev_month_count',
            type: 'int',
            default: 0,
            comment: 'online_house like count in prev month',
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
      'online_house_like_count',
      new TableForeignKey({
        name: 'FK_online_house_like_count_entity_id',
        columnNames: ['entity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'online_houses',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'online_house_like_count',
      'FK_online_house_like_count_entity_id',
    );
    await queryRunner.dropTable('online_house_like_count', true);
  }
}

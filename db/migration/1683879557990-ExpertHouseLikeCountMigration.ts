import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class ExpertHouseLikeCountMigration1683879557990
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'expert_house_like_count',
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
            comment: 'expert_house like count in this month',
          },
          {
            name: 'prev_month_count',
            type: 'int',
            default: 0,
            comment: 'expert_house like count in prev month',
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
      'expert_house_like_count',
      new TableForeignKey({
        name: 'FK_expert_house_like_count_entity_id',
        columnNames: ['entity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'expert_houses',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'expert_house_like_count',
      'FK_expert_house_like_count_entity_id',
    );
    await queryRunner.dropTable('expert_house_like_count', true);
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class LikeMigration1683861138062 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'like_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            unsigned: true,
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'entity_id',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'like_items',
      new TableIndex({
        name: 'like-type-idx',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'like_items',
      new TableIndex({
        name: 'like-user-idx',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'like_items',
      new TableIndex({
        name: 'UQ_like_items_type_entity_id_user_id',
        columnNames: ['type', 'entity_id', 'user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'like_items',
      'UQ_like_items_type_entity_id_user_id',
    );
    await queryRunner.dropIndex('like_items', 'like-user-idx');
    await queryRunner.dropIndex('like_items', 'like-type-idx');
    await queryRunner.dropTable('like_items');
  }
}

import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class WishMigration1682953939026 implements MigrationInterface {
  name = 'WishMigration1682953939026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`wish_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` varchar(45) NOT NULL COMMENT 'This indicates wish entity type. For example, smart_store, product etc', \`user_id\` int NOT NULL COMMENT 'This indicates user id', \`entity_id\` int NOT NULL COMMENT 'This indicates entity id for specfic entity which is determined by type', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`wish-type-idx\` (\`type\`), INDEX \`wish-user-idx\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );

    await queryRunner.createIndex(
      'wish_items',
      new TableIndex({
        name: 'UQ_wish_items_type_entity_id_user_id',
        columnNames: ['type', 'entity_id', 'user_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'wish_items',
      'UQ_wish_items_type_entity_id_user_id',
    );
    await queryRunner.query(`DROP INDEX \`wish-user-idx\` ON \`wish_items\``);
    await queryRunner.query(`DROP INDEX \`wish-type-idx\` ON \`wish_items\``);
    await queryRunner.query(`DROP TABLE \`wish_items\``);
  }
}

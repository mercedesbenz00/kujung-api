import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryTreeMigration1682695138614 implements MigrationInterface {
  name = 'CategoryTreeMigration1682695138614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`categories_tree\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`depth\` int NOT NULL, \`image_url\` varchar(2048) NOT NULL, \`desc\` text NOT NULL, \`tags\` varchar(255) NULL, \`hidden\` tinyint NOT NULL DEFAULT 0, \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categories_tree_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_044a43ec8dbc7f535b633912c8\` (\`id_ancestor\`), INDEX \`IDX_11fe45ba90a97a7387a9434657\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories_tree\` ADD CONSTRAINT \`FK_e9de55c16f0c414ccd232c9ae5b\` FOREIGN KEY (\`parentId\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories_tree_closure\` ADD CONSTRAINT \`FK_044a43ec8dbc7f535b633912c8a\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories_tree_closure\` ADD CONSTRAINT \`FK_11fe45ba90a97a7387a94346575\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`categories_tree_closure\` DROP FOREIGN KEY \`FK_11fe45ba90a97a7387a94346575\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories_tree_closure\` DROP FOREIGN KEY \`FK_044a43ec8dbc7f535b633912c8a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`categories_tree\` DROP FOREIGN KEY \`FK_e9de55c16f0c414ccd232c9ae5b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_11fe45ba90a97a7387a9434657\` ON \`categories_tree_closure\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_044a43ec8dbc7f535b633912c8\` ON \`categories_tree_closure\``,
    );
    await queryRunner.query(`DROP TABLE \`categories_tree_closure\``);
    await queryRunner.query(`DROP TABLE \`categories_tree\``);
  }
}

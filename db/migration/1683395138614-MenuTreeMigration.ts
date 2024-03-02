import { MigrationInterface, QueryRunner } from 'typeorm';

export class MenuTreeMigration1683395138614 implements MigrationInterface {
  name = 'MenuTreeMigration1683395138614';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`menus_tree\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`desc\` text NOT NULL, \`hidden\` tinyint NOT NULL DEFAULT 0, \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`menus_tree_closure\` (\`id_ancestor\` int NOT NULL, \`id_descendant\` int NOT NULL, INDEX \`IDX_044a43ec8dbc7f535b633912c9\` (\`id_ancestor\`), INDEX \`IDX_11fe45ba90a97a7387a9434657\` (\`id_descendant\`), PRIMARY KEY (\`id_ancestor\`, \`id_descendant\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`menus_tree\` ADD CONSTRAINT \`FK_MENUS_TREE_PARENT_ID\` FOREIGN KEY (\`parentId\`) REFERENCES \`menus_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`menus_tree_closure\` ADD CONSTRAINT \`FK_MENU_CLOSURE_ANCESTORE\` FOREIGN KEY (\`id_ancestor\`) REFERENCES \`menus_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`menus_tree_closure\` ADD CONSTRAINT \`FK_MENU_CLOSURE_DESCENDANT\` FOREIGN KEY (\`id_descendant\`) REFERENCES \`menus_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`menus_tree_closure\` DROP FOREIGN KEY \`FK_MENU_CLOSURE_DESCENDANT\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`menus_tree_closure\` DROP FOREIGN KEY \`FK_MENU_CLOSURE_ANCESTORE\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`menus_tree\` DROP FOREIGN KEY \`FK_MENUS_TREE_PARENT_ID\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_11fe45ba90a97a7387a9434657\` ON \`menus_tree_closure\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_044a43ec8dbc7f535b633912c9\` ON \`menus_tree_closure\``,
    );
    await queryRunner.query(`DROP TABLE \`menus_tree_closure\``);
    await queryRunner.query(`DROP TABLE \`menus_tree\``);
  }
}

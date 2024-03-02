import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminMenuMigration1683405265015 implements MigrationInterface {
  name = 'AdminMenuMigration1683405265015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`admin_menus\` (\`admin_id\` int NOT NULL, \`menu_id\` int NOT NULL, PRIMARY KEY (\`admin_id\`, \`menu_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_ADMIN_MENUS_ADMIN_ID\` ON \`admin_menus\` (\`admin_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_ADMIN_MENUS_MENU_ID\` ON \`admin_menus\` (\`menu_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`admin_menus\` ADD CONSTRAINT \`FK_ADMIN_MENUS_ADMIN_ID\` FOREIGN KEY (\`admin_id\`) REFERENCES \`admins\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`admin_menus\` ADD CONSTRAINT \`FK_ADMIN_MENUS_MENU_ID\` FOREIGN KEY (\`menu_id\`) REFERENCES \`menus_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`admin_menus\` DROP FOREIGN KEY \`FK_ADMIN_MENUS_MENU_ID\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`admin_menus\` DROP FOREIGN KEY \`FK_ADMIN_MENUS_ADMIN_ID\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ADMIN_MENUS_MENU_ID\` ON \`admin_menus\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_ADMIN_MENUS_ADMIN_ID\` ON \`admin_menus\``,
    );
    await queryRunner.query(`DROP TABLE \`admin_menus\``);
  }
}

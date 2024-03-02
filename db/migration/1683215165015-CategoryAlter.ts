import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryAlter1683215165015 implements MigrationInterface {
  name = 'CategoryAlter1683215165015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image_url\` varchar(2048) NOT NULL, \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`category_youtubes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NULL COMMENT 'Youtube title', \`summary\` text NULL COMMENT 'Youtube summary', \`url\` varchar(2048) NOT NULL COMMENT 'youtube url', \`thumb_url\` varchar(2048) NULL COMMENT 'youtube thumb url', \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category_images\` ADD CONSTRAINT \`FK_4f166bb8c2bfcef2498d97b4069\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category_youtubes\` ADD CONSTRAINT \`FK_17bbbf0e29b71f0467c04802b49\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category_youtubes\` DROP FOREIGN KEY \`FK_17bbbf0e29b71f0467c04802b49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category_images\` DROP FOREIGN KEY \`FK_4f166bb8c2bfcef2498d97b4069\``,
    );
    await queryRunner.query(`DROP TABLE \`category_youtubes\``);
    await queryRunner.query(`DROP TABLE \`category_images\``);
  }
}

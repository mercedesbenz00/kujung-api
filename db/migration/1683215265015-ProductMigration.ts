import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductMigration1683215265015 implements MigrationInterface {
  name = 'ProductMigration1683215265015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_images\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image_url\` varchar(2048) NOT NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_blogs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL COMMENT 'Blog title', \`summary\` text NULL COMMENT 'Blog summary', \`url\` varchar(2048) NOT NULL COMMENT 'blog url', \`thumb_url\` varchar(2048) NULL COMMENT 'blog thumb url', \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_youtubes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL COMMENT 'Youtube title', \`summary\` text NULL COMMENT 'Youtube summary', \`url\` varchar(2048) NOT NULL COMMENT 'youtube url', \`thumb_url\` varchar(2048) NULL COMMENT 'youtube thumb url', \`product_id\` int NULL, UNIQUE INDEX \`REL_17bbbf0e29b71f0467c04802b4\` (\`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL COMMENT 'Product title', \`construction_law\` text NOT NULL COMMENT 'Construction law', \`size_w\` decimal(10,2) NOT NULL COMMENT 'w size' DEFAULT '0.00', \`size_l\` decimal(10,2) NOT NULL COMMENT 'l size' DEFAULT '0.00', \`size_t\` decimal(10,2) NOT NULL COMMENT 't size' DEFAULT '0.00', \`desc\` varchar(1024) NULL COMMENT 'product description', \`color\` text NULL COMMENT 'product color', \`residence_type\` varchar(255) NULL COMMENT 'residencye type', \`style\` varchar(255) NULL COMMENT 'product style', \`area_min\` tinyint NULL COMMENT 'area space min value', \`area_max\` tinyint NULL COMMENT 'area space max value', \`wish_count\` INT UNSIGNED NOT NULL COMMENT 'product wish count' DEFAULT 0, \`view_count\` INT UNSIGNED NOT NULL COMMENT 'product view count' DEFAULT 0, \`thumbnail_url\` varchar(2048) NULL COMMENT 'product thumbnail url', \`detail_info\` longblob NULL COMMENT 'product detail information', \`selected_icons\` varchar(255) NULL COMMENT 'product selected icon comma joined string. For example, "New, Best"', \`hidden\` tinyint NOT NULL COMMENT 'product hidden flag' DEFAULT 0, \`created_by\` int NULL, \`updated_by\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_level1_id\` int NULL, \`category_level2_id\` int NULL, \`category_level3_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product_tags\` (\`product_id\` int NOT NULL, \`tag_id\` int NOT NULL, PRIMARY KEY (\`product_id\`, \`tag_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_5b0c6fc53c574299ecc7f9ee22\` ON \`product_tags\` (\`product_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f2cd3faf2e129a4c69c05a291e\` ON \`product_tags\` (\`tag_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images\` ADD CONSTRAINT \`FK_4f166bb8c2bfcef2498d97b4068\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_blogs\` ADD CONSTRAINT \`FK_419b37398e965176912bb4bbffb\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_youtubes\` ADD CONSTRAINT \`FK_17bbbf0e29b71f0467c04802b48\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_2f24759d559cdde31b9bed28869\` FOREIGN KEY (\`category_level1_id\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_c0e2c44629e5fa766e262367074\` FOREIGN KEY (\`category_level2_id\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_2b95283b784757883f970bb58e3\` FOREIGN KEY (\`category_level3_id\`) REFERENCES \`categories_tree\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_tags\` ADD CONSTRAINT \`FK_5b0c6fc53c574299ecc7f9ee22e\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_tags\` ADD CONSTRAINT \`FK_f2cd3faf2e129a4c69c05a291e8\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_tags\` DROP FOREIGN KEY \`FK_f2cd3faf2e129a4c69c05a291e8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_tags\` DROP FOREIGN KEY \`FK_5b0c6fc53c574299ecc7f9ee22e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_2b95283b784757883f970bb58e3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_c0e2c44629e5fa766e262367074\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_2f24759d559cdde31b9bed28869\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_youtubes\` DROP FOREIGN KEY \`FK_17bbbf0e29b71f0467c04802b48\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_blogs\` DROP FOREIGN KEY \`FK_419b37398e965176912bb4bbffb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_images\` DROP FOREIGN KEY \`FK_4f166bb8c2bfcef2498d97b4068\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f2cd3faf2e129a4c69c05a291e\` ON \`product_tags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5b0c6fc53c574299ecc7f9ee22\` ON \`product_tags\``,
    );
    await queryRunner.query(`DROP TABLE \`product_tags\``);
    await queryRunner.query(`DROP TABLE \`products\``);
    await queryRunner.query(
      `DROP INDEX \`REL_17bbbf0e29b71f0467c04802b4\` ON \`product_youtubes\``,
    );
    await queryRunner.query(`DROP TABLE \`product_youtubes\``);
    await queryRunner.query(`DROP TABLE \`product_blogs\``);
    await queryRunner.query(`DROP TABLE \`product_images\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductSimilar1683226017690 implements MigrationInterface {
  name = 'ProductSimilar1683226017690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`product_similars\` (\`product_id\` int NOT NULL, \`product_sm_id\` int NOT NULL, PRIMARY KEY (\`product_id\`, \`product_sm_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_87b8888186ca9769c960e92688\` ON \`product_similars\` (\`product_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_b23c65e50a758245a33ee35fdb\` ON \`product_similars\` (\`product_sm_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_similars\` ADD CONSTRAINT \`FK_87b8888186ca9769c960e926871\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_similars\` ADD CONSTRAINT \`FK_b23c65e50a758245a33ee35fda2\` FOREIGN KEY (\`product_sm_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`product_similars\` DROP FOREIGN KEY \`FK_b23c65e50a758245a33ee35fda2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`product_similars\` DROP FOREIGN KEY \`FK_87b8888186ca9769c960e926871\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b23c65e50a758245a33ee35fdb\` ON \`product_similars\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_87b8888186ca9769c960e92688\` ON \`product_similars\``,
    );
    await queryRunner.query(`DROP TABLE \`product_similars\``);
  }
}

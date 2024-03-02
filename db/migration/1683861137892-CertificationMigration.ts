import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';
export class CertificationMigration1683861137892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'certifications',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
            comment: 'Certification title',
          },
          {
            name: 'variety',
            type: 'varchar',
            comment: 'Certification variety',
          },
          {
            name: 'product_name',
            type: 'varchar',
            comment: 'Certification product name',
          },
          {
            name: 'authority',
            type: 'varchar',
            comment: 'Certification authority',
          },
          {
            name: 'certification_type_code',
            type: 'int',
            isNullable: true,
            default: null,
            comment: 'Certification type code',
          },
          {
            name: 'attachment_file',
            type: 'varchar',
            length: '2048',
            comment: 'Certification attachment file',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url',
            type: 'varchar',
            length: '2048',
            comment: 'thumb url',
            isNullable: true,
            default: null,
          },
          {
            name: 'thumb_url_mobile',
            type: 'varchar',
            length: '2048',
            comment: 'thumb url for mobile',
            isNullable: true,
            default: null,
          },
          {
            name: 'start_at',
            type: 'datetime(6)',
            comment: 'Start date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'end_at',
            type: 'datetime(6)',
            comment: 'End date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP(6)',
          },
          {
            name: 'updated_at',
            type: 'datetime(6)',
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'certifications',
      new TableIndex({
        columnNames: ['title'],
        name: 'idx_certifications_title',
      }),
    );
    await queryRunner.createIndex(
      'certifications',
      new TableIndex({
        columnNames: ['variety'],
        name: 'idx_certifications_variety',
      }),
    );
    await queryRunner.createIndex(
      'certifications',
      new TableIndex({
        columnNames: ['product_name'],
        name: 'idx_certifications_product_name',
      }),
    );

    await queryRunner.createForeignKey(
      'certifications',
      new TableForeignKey({
        columnNames: ['certification_type_code'],
        referencedTableName: 'common_constants',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
        name: 'FK_certifications_certification_type_code_common_constants',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'certifications',
      'FK_certifications_certification_type_code_common_constants',
    );
    await queryRunner.dropIndex('certifications', 'idx_certifications_title');
    await queryRunner.dropIndex('certifications', 'idx_certifications_variety');
    await queryRunner.dropIndex(
      'certifications',
      'idx_certifications_product_name',
    );
    await queryRunner.dropTable('certifications');
  }
}

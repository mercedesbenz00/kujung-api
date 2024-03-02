import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableColumn,
} from 'typeorm';

export class AlterSmartConstructionCase1683865018020
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'smart_construction_cases',
      new TableColumn({
        name: 'family_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'family type code',
      }),
    );

    await queryRunner.createForeignKey(
      'smart_construction_cases',
      new TableForeignKey({
        name: 'FK_smart_construction_cases_family_type_code_common_constants',
        columnNames: ['family_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.dropColumns('smart_construction_cases', [
      'residence_type',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'smart_construction_cases',
      'FK_smart_construction_cases_family_type_code_common_constants',
    );
    await queryRunner.addColumn(
      'smart_construction_cases',
      new TableColumn({
        name: 'residence_type',
        type: 'varchar',
        isNullable: true,
        comment: 'residency type',
      }),
    );
    await queryRunner.dropColumns('smart_construction_cases', [
      'family_type_code',
    ]);
  }
}

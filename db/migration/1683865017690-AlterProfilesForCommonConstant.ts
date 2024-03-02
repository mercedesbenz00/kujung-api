import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class AlterProfilesForCommonConstant1683865017690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('profiles', 'gender');
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'gender',
        type: 'enum',
        enum: ['M', 'F'],
        default: null,
        isNullable: true,
      }),
    );

    await queryRunner.dropColumn('profiles', 'area_min');
    await queryRunner.dropColumn('profiles', 'area_max');
    await queryRunner.dropColumn('profiles', 'preferred_floor_color');
    await queryRunner.dropColumn('profiles', 'age_min');
    await queryRunner.dropColumn('profiles', 'age_max');
    await queryRunner.dropColumn('profiles', 'house_type');
    await queryRunner.dropColumn('profiles', 'live_with');
    await queryRunner.dropColumn('profiles', 'preferred_style_multi');
    await queryRunner.dropColumn('profiles', 'preferred_feeling');

    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'age_range_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'age range code',
      }),
    );
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'color_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'color code',
      }),
    );
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'area_space_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'area space code',
      }),
    );
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'house_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'house type code',
      }),
    );
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'family_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'family type code',
      }),
    );
    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'interior_feeling_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'interior feeling code',
      }),
    );
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_age_range_code_common_constants',
        columnNames: ['age_range_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_color_code_common_constants',
        columnNames: ['color_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_area_space_code_common_constants',
        columnNames: ['area_space_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_house_type_code_common_constants',
        columnNames: ['house_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_family_type_code_common_constants',
        columnNames: ['family_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_interior_feeling_code_common_constants',
        columnNames: ['interior_feeling_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'profiles',
      'gender',
      new TableColumn({
        name: 'gender',
        type: 'varchar(255)',
        default: null,
        isNullable: true,
      }),
    );

    await queryRunner.dropForeignKey(
      'profiles',
      'FK_profiles_age_range_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'profiles',
      'FK_profiles_color_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'profiles',
      'FK_profiles_area_space_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'profiles',
      'FK_profiles_house_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'profiles',
      'FK_profiles_family_type_code_common_constants',
    );
    await queryRunner.dropForeignKey(
      'profiles',
      'FK_profiles_interior_feeling_code_common_constants',
    );

    await queryRunner.dropColumns('profiles', [
      'age_range_code',
      'color_code',
      'area_space_code',
      'house_type_code',
      'family_type_code',
      'interior_feeling_code',
    ]);
  }
}

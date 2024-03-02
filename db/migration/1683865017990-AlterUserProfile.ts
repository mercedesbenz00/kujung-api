import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class AlterUserProfile1683865017990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'company_name',
        type: 'varchar',
        default: null,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'profiles',
      new TableColumn({
        name: 'user_id',
        type: 'int',
        isNullable: true,
        isUnique: true,
        default: null,
        comment: 'user id',
      }),
    );

    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        name: 'FK_profiles_user_id_users',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('profiles', 'FK_profiles_user_id_users');

    await queryRunner.dropColumn('profiles', 'user_id');
    await queryRunner.dropColumn('users', 'company_name');
  }
}

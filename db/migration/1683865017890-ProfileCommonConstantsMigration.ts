import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class ProfileCommonConstantsMigration1683865017890
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "profile_common_constants" table
    await queryRunner.createTable(
      new Table({
        name: 'profile_common_constants',
        columns: [
          {
            name: 'profile_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'common_constant_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "profiles" table
    await queryRunner.createForeignKey(
      'profile_common_constants',
      new TableForeignKey({
        name: 'FK_profile_common_constants_profile_id_profiles',
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'profiles',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "tags" table
    await queryRunner.createForeignKey(
      'profile_common_constants',
      new TableForeignKey({
        name: 'FK_profile_common_constants_common_constant_id_constants',
        columnNames: ['common_constant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );

    // Add unique constraint for the pair (profile_id, common_constant_id)
    await queryRunner.createIndex(
      'profile_common_constants',
      new TableIndex({
        name: 'UQ_profile_id_common_constant_id',
        columnNames: ['profile_id', 'common_constant_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the unique constraint
    await queryRunner.dropIndex(
      'profile_common_constants',
      'UQ_profile_id_common_constant_id',
    );

    // Drop the foreign key relationships
    await queryRunner.dropForeignKey(
      'profile_common_constants',
      'FK_profile_common_constants_common_constant_id_constants',
    );
    await queryRunner.dropForeignKey(
      'profile_common_constants',
      'FK_profile_common_constants_profile_id_profiles',
    );

    // Drop the "profile_common_constants" table
    await queryRunner.dropTable('profile_common_constants');
  }
}

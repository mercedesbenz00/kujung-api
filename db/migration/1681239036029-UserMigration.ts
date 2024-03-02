import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class UserMigration1681239036029 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            comment: 'User name',
          },
          {
            name: 'user_id',
            comment: 'user id',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            comment: 'User email',
          },
          {
            name: 'phone',
            type: 'varchar',
            comment: 'Phone number',
            isNullable: true,
          },
          {
            name: 'like_count',
            type: 'int',
            default: 0,
            comment: 'like count',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'nickname',
            type: 'varchar',
            comment: 'nick name',
          },
          {
            name: 'brand',
            type: 'varchar',
            comment: 'business user company brand',
            default: null,
            isNullable: true,
          },
          {
            name: 'addr',
            type: 'varchar',
            comment: 'User address',
            default: null,
            isNullable: true,
          },
          {
            name: 'addr_sub',
            type: 'varchar',
            comment: 'User sub address',
            default: null,
            isNullable: true,
          },
          {
            name: 'zonecode',
            type: 'varchar',
            comment: 'User 2nd sub address',
            default: null,
            isNullable: true,
          },
          {
            name: 'provider',
            type: 'varchar(64)',
            comment: 'User account provider',
            default: 'normal',
            isNullable: true,
          },
          {
            name: 'provider_id',
            type: 'varchar(64)',
            comment: 'User account provider id',
            default: 'normal',
            isNullable: true,
          },
          {
            name: 'profile_id',
            type: 'int',
            comment: 'Foreign key for user profile info',
            default: null,
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedTableName: 'profiles',
        referencedColumnNames: ['id'],
        // onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

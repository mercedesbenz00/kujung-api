import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AdminMigration1682005017580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
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
            comment: 'Admin name',
          },
          {
            name: 'user_id',
            comment: 'user id',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            comment: 'Admin email',
          },
          {
            name: 'phone',
            type: 'varchar',
            comment: 'Phone number',
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'nickname',
            type: 'varchar',
            comment: 'Nick name',
          },
          {
            name: 'gender',
            type: 'varchar(10)',
            default: 'M',
            comment: 'User gender. M, F',
          },
          {
            name: 'disabled',
            type: 'bool',
            default: false,
            comment: 'Enable/Disable flag',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admins');
  }
}

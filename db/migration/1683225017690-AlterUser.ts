import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class AlterUser1683225017690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'account_type',
        comment: 'Account type. {general, business}',
        type: 'varchar(20)',
        default: "'general'",
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'business_type',
        comment: 'Business type. {interior, agency_store}',
        type: 'varchar(20)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'business_reg_num',
        comment: 'Business registration number',
        type: 'varchar(128)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'manager_type',
        comment: 'Manager type. {individual, legal}',
        type: 'varchar(20)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'contact_name',
        comment: 'Company contact name',
        type: 'varchar(50)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'company_phone',
        comment: 'Company phone number',
        type: 'varchar(20)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'approved_at',
        comment: 'Company approval date',
        type: 'datetime(6)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'point',
        comment: 'Account point',
        type: 'int',
        unsigned: true,
        default: 0,
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_account_type',
        columnNames: ['account_type'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_business_type',
        columnNames: ['business_type'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_manager_type',
        columnNames: ['manager_type'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_created_at',
        columnNames: ['created_at'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_name',
        columnNames: ['name'],
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_nickname',
        columnNames: ['nickname'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'idx_users_account_type');
    await queryRunner.dropIndex('users', 'idx_users_business_type');
    await queryRunner.dropIndex('users', 'idx_users_manager_type');
    await queryRunner.dropIndex('users', 'idx_users_created_at');
    await queryRunner.dropIndex('users', 'idx_users_name');
    await queryRunner.dropIndex('users', 'idx_users_nickname');

    await queryRunner.dropColumn('users', 'account_type');
    await queryRunner.dropColumn('users', 'business_type');
    await queryRunner.dropColumn('users', 'business_reg_num');
    await queryRunner.dropColumn('users', 'manager_type');
    await queryRunner.dropColumn('users', 'contact_name');
    await queryRunner.dropColumn('users', 'company_phone');
    await queryRunner.dropColumn('users', 'approved_at');
    await queryRunner.dropColumn('users', 'point');
  }
}

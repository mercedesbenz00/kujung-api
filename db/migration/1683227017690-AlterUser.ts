import {
  MigrationInterface,
  QueryRunner,
  TableIndex,
  TableColumn,
} from 'typeorm';

export class AlterUser1683227017690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'status',
        comment:
          'User status. {waiting_approval, active, idle, waiting_inactive, inactive}',
        type: 'varchar(20)',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'allow_sms_recv',
        comment: 'sms receive allow flag',
        type: 'bool',
        default: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'allow_email_recv',
        comment: 'email receive allow flag',
        type: 'bool',
        default: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'inactive_reason',
        comment: 'user/business inactive(exit) reason',
        type: 'varchar(40)',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'inactive_reason_desc',
        comment: 'user/business inactive(exit) reason desc',
        type: 'text',
        isNullable: true,
        default: null,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'inactive_at',
        comment: 'User account exit date',
        type: 'datetime(6)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'inactive_by_admin',
        comment: 'flag which admin did make inactive or not',
        type: 'bool',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'idle_at',
        comment: 'User idle start date',
        type: 'datetime(6)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'last_login_at',
        comment: 'User last login date',
        type: 'datetime(6)',
        default: null,
        isNullable: true,
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'idx_users_status');

    await queryRunner.dropColumn('users', 'status');
    await queryRunner.dropColumn('users', 'allow_sms_recv');
    await queryRunner.dropColumn('users', 'allow_email_recv');
    await queryRunner.dropColumn('users', 'inactive_reason');
    await queryRunner.dropColumn('users', 'inactive_reason_desc');
    await queryRunner.dropColumn('users', 'inactive_at');
    await queryRunner.dropColumn('users', 'inactive_by_admin');
    await queryRunner.dropColumn('users', 'idle_at');
    await queryRunner.dropColumn('users', 'last_login_at');
  }
}

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class SmsDeliveryMigration1683630037690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sms_delivery',
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
            comment: 'recipient name',
          },
          {
            name: 'nickname',
            type: 'varchar',
            comment: 'recipient nickname',
          },
          {
            name: 'phone',
            type: 'varchar',
            comment: 'recipient phone',
          },
          {
            name: 'content',
            type: 'text',
            comment: 'sms content',
            isNullable: true,
            default: null,
          },
          {
            name: 'sent_at',
            type: 'datetime(6)',
            comment: 'sms sent date time',
            isNullable: true,
            default: null,
          },
          {
            name: 'status',
            type: 'tinyint',
            comment: 'delivery status, 0: in progress, 1: success, 2: failure',
            unsigned: true,
            default: 0,
          },
          {
            name: 'created_by',
            type: 'int',
            default: null,
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'int',
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

    await queryRunner.createIndex(
      'sms_delivery',
      new TableIndex({
        name: 'idx_sms_delivery_name',
        columnNames: ['name'],
      }),
    );
    await queryRunner.createIndex(
      'sms_delivery',
      new TableIndex({
        name: 'idx_sms_delivery_nickname',
        columnNames: ['nickname'],
      }),
    );
    await queryRunner.createIndex(
      'sms_delivery',
      new TableIndex({
        name: 'idx_sms_delivery_phone',
        columnNames: ['phone'],
      }),
    );
    await queryRunner.createIndex(
      'sms_delivery',
      new TableIndex({
        name: 'idx_sms_delivery_sent_at',
        columnNames: ['sent_at'],
      }),
    );
    await queryRunner.createIndex(
      'sms_delivery',
      new TableIndex({
        name: 'idx_sms_delivery_updated_at',
        columnNames: ['updated_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('sms_delivery', 'idx_sms_delivery_updated_at');
    await queryRunner.dropIndex('sms_delivery', 'idx_sms_delivery_sent_at');
    await queryRunner.dropIndex('sms_delivery', 'idx_sms_delivery_phone');
    await queryRunner.dropIndex('sms_delivery', 'idx_sms_delivery_nickname');
    await queryRunner.dropIndex('sms_delivery', 'idx_sms_delivery_name');
    await queryRunner.dropTable('sms_delivery');
  }
}

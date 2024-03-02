import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ProfileMigration1681149595433 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'gender',
            type: 'varchar',
            comment: 'User gender. M, W',
            default: null,
            isNullable: true,
          },
          {
            name: 'age_min',
            type: 'tinyint',
            comment: 'User age min value',
            default: null,
            isNullable: true,
          },
          {
            name: 'age_max',
            type: 'tinyint',
            comment: 'User age max value',
            default: null,
            isNullable: true,
          },
          {
            name: 'preferred_floor_color',
            comment: 'Preferred floor color',
            type: 'varchar',
          },
          {
            name: 'area_min',
            comment: 'Area min value',
            type: 'tinyint',
            default: null,
            isNullable: true,
          },
          {
            name: 'area_max',
            comment: 'Area max value',
            type: 'tinyint',
            default: null,
            isNullable: true,
          },
          {
            name: 'house_type',
            comment: 'House type value. one_room|villa|flat|single_house',
            type: 'varchar',
          },
          {
            name: 'live_with',
            comment: 'live with',
            type: 'varchar',
          },
          {
            name: 'preferred_style_multi',
            type: 'varchar',
            comment: 'Preferred styles which are joined by comma',
            default: null,
            isNullable: true,
          },
          {
            name: 'preferred_feeling',
            comment: 'Preferred feeling',
            type: 'varchar',
          },
          {
            name: 'join_reason',
            comment: 'Join reason',
            type: 'varchar',
            default: null,
            isNullable: true,
          },
          {
            name: 'photo',
            type: 'varchar',
            comment: 'User photo',
            default: null,
            isNullable: true,
          },
          {
            name: 'show_private_privacy',
            comment: 'Show private privacy',
            type: 'bool',
            default: false,
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
    await queryRunner.dropTable('profiles');
  }
}

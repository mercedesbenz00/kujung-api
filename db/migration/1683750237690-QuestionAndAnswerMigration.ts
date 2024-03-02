import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class QuestionAndAnswerMigration1683750237690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'question_and_answers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'question_title',
            type: 'varchar',
            comment: 'question title',
          },
          {
            name: 'question_type',
            type: 'varchar',
            comment: 'question type',
          },
          {
            name: 'question_content',
            type: 'text',
            isNullable: true,
            comment: 'question content',
          },
          {
            name: 'answer_title',
            type: 'varchar',
            isNullable: true,
            default: null,
            comment: 'answer title',
          },
          {
            name: 'answer_content',
            type: 'text',
            isNullable: true,
            comment: 'answer content',
          },
          {
            name: 'status',
            type: 'int',
            default: 0,
            comment: 'status. 0: waiting, 1: completed, 2: rejected',
          },
          {
            name: 'requested_by',
            type: 'int',
            isNullable: true,
            comment: 'user id who requested',
          },
          {
            name: 'managed_by',
            type: 'int',
            isNullable: true,
            comment: 'admin id who updated status',
          },
          {
            name: 'requested_at',
            type: 'datetime(6)',
            isNullable: true,
            default: null,
            comment: 'requested date time',
          },
          {
            name: 'rejected_at',
            type: 'datetime(6)',
            isNullable: true,
            default: null,
            comment: 'rejected date time',
          },
          {
            name: 'completed_at',
            type: 'datetime(6)',
            isNullable: true,
            default: null,
            comment: 'completed date time',
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
          // Add more columns as needed
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Add indexes
    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_question_title',
        columnNames: ['question_title'],
      }),
    );

    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_question_type',
        columnNames: ['question_type'],
      }),
    );

    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_requested_at',
        columnNames: ['requested_at'],
      }),
    );

    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_rejected_at',
        columnNames: ['rejected_at'],
      }),
    );

    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_completed_at',
        columnNames: ['completed_at'],
      }),
    );

    // Create the foreign key relationship with "users" table
    await queryRunner.createForeignKey(
      'question_and_answers',
      new TableForeignKey({
        name: 'FK_question_and_answers_requested_by_users',
        columnNames: ['requested_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    // Create the foreign key relationship with "admins" table
    await queryRunner.createForeignKey(
      'question_and_answers',
      new TableForeignKey({
        name: 'FK_question_and_answers_managed_by_admins',
        columnNames: ['managed_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'admins',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'question_and_answers',
      'FK_question_and_answers_requested_by_users',
    );
    await queryRunner.dropForeignKey(
      'question_and_answers',
      'FK_question_and_answers_managed_by_admins',
    );

    // Drop the indexes

    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_question_title',
    );
    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_question_type',
    );
    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_status',
    );
    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_requested_at',
    );
    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_rejected_at',
    );
    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_completed_at',
    );

    // Drop the "question_and_answers" table
    await queryRunner.dropTable('question_and_answers');
  }
}

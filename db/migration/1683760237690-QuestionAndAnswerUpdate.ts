import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class QuestionAndAnswerUpdate1683760237690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'answer_updated_at',
        type: 'datetime(6)',
        isNullable: true,
        default: null,
        comment: 'answer updated date time',
      }),
    );
    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'answer_created_at',
        type: 'datetime(6)',
        isNullable: true,
        default: null,
        comment: 'answer created date time',
      }),
    );
    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'question_updated_at',
        type: 'datetime(6)',
        isNullable: true,
        default: null,
        comment: 'question updated date time',
      }),
    );
    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'answer_updated_by',
        type: 'int',
        isNullable: true,
        comment: 'admin id who updated answer',
      }),
    );
    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'question_updated_by',
        type: 'int',
        isNullable: true,
        comment: 'user id who updated question',
      }),
    );

    await queryRunner.createForeignKey(
      'question_and_answers',
      new TableForeignKey({
        name: 'FK_question_and_answers_question_updated_by_users',
        columnNames: ['question_updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );

    await queryRunner.createForeignKey(
      'question_and_answers',
      new TableForeignKey({
        name: 'FK_question_and_answers_answer_updated_by_admins',
        columnNames: ['answer_updated_by'],
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
      'FK_question_and_answers_question_updated_by_users',
    );
    await queryRunner.dropForeignKey(
      'question_and_answers',
      'FK_question_and_answers_answer_updated_by_admins',
    );
    await queryRunner.dropColumn('question_and_answers', 'answer_updated_at');
    await queryRunner.dropColumn('question_and_answers', 'answer_created_at');
    await queryRunner.dropColumn('question_and_answers', 'question_updated_at');
    await queryRunner.dropColumn('question_and_answers', 'answer_updated_by');
    await queryRunner.dropColumn('question_and_answers', 'question_updated_by');
  }
}

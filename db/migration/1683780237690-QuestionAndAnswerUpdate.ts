import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class QuestionAndAnswerUpdate1683780237690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'question_and_answers',
      'idx_question_and_answer_question_type',
    );
    await queryRunner.dropColumn('question_and_answers', 'question_type');

    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'question_type_code',
        type: 'int',
        isNullable: true,
        default: null,
        comment: 'question type code',
      }),
    );

    await queryRunner.createForeignKey(
      'question_and_answers',
      new TableForeignKey({
        name: 'FK_question_and_answers_question_type_code_common_constants',
        columnNames: ['question_type_code'],
        referencedColumnNames: ['id'],
        referencedTableName: 'common_constants',
        onDelete: 'SET NULL',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'question_and_answers',
      'FK_question_and_answers_question_type_code_common_constants',
    );
    await queryRunner.dropColumn('question_and_answers', 'question_type_code');

    await queryRunner.addColumn(
      'question_and_answers',
      new TableColumn({
        name: 'question_type',
        type: 'varchar',
        isNullable: true,
        comment: 'question type',
      }),
    );

    await queryRunner.createIndex(
      'question_and_answers',
      new TableIndex({
        name: 'idx_question_and_answer_question_type',
        columnNames: ['question_type'],
      }),
    );
  }
}

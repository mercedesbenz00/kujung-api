import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class AnswerImagesMigration1683750438890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the "answer_images" table
    await queryRunner.createTable(
      new Table({
        name: 'answer_images',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '2048',
          },
          {
            name: 'question_and_answer_id',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true, // Set "true" to automatically create the table's primary key sequence
    );

    // Create the foreign key relationship with "questions" table
    await queryRunner.createForeignKey(
      'answer_images',
      new TableForeignKey({
        name: 'FK_answer_images_question_and_answer_id_question_and_answers',
        columnNames: ['question_and_answer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'question_and_answers',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key relationship
    await queryRunner.dropForeignKey(
      'answer_images',
      'FK_answer_images_question_and_answer_id_question_and_answers',
    );

    // Drop the "answer_images" table
    await queryRunner.dropTable('answer_images');
  }
}

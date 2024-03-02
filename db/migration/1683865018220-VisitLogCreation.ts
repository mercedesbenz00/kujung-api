import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class VisitLogCreation1683865018220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'visit_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'timestamp',
            type: 'datetime',
          },
          {
            name: 'user_id',
            type: 'int',
          },
        ],
      }),
      true,
    );

    // Add foreign key constraint for the user_id column referencing the user table
    await queryRunner.createForeignKey(
      'visit_logs',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint first to avoid errors when dropping the table
    const table = await queryRunner.getTable('visit_logs');
    const foreignKey = table.foreignKeys.find((fk) =>
      fk.columnNames.includes('user_id'),
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('visit_logs', foreignKey);
    }

    await queryRunner.dropTable('visit_logs');
  }
}

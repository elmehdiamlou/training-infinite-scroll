import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConversationTable1694441634733
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE conversation(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversationname VARCHAR(255),
        date TIMESTAMP
    )`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessageTable1694441652830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE message(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        requestmessage VARCHAR(255),
        responsemessage JSONB,
        date TIMESTAMP,
        conversation_id UUID REFERENCES conversation(id)
    )`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}

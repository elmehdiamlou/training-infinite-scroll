import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationTable1694518444320
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE notification(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content VARCHAR(255),
        date TIMESTAMP
    )`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(): Promise<void> {}
}

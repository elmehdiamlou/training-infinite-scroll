import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'peaqock',
  password: 'peaqock',
  database: 'infinite-scroll',
  entities: ['dist/nestjs-backend/src/entities/*'],
  migrations: ['dist/nestjs-backend/src/migrations/*'],
});

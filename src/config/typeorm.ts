import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });

const config = {
  type: 'mysql',
  logging: true,
  // ssl: true,
  host: `${process.env.DB_HOST}`,
  port: +`${process.env.DB_PORT}`,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*-migration.ts'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('mysql', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);

import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
// import { Category } from '../components/category/entities/category.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT as string),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: ['dist/**/*.entity{.ts,.js}'],
  // entities: [Category],
  migrations: ['dist/db/migration/**/*.{js,ts}'],
  migrationsTableName: 'migrations',
  timezone: 'UTC',
  // logging: true, // Enable query logging
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

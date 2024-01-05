import "dotenv/config";
import { get } from "env-var";
import { DataSource, DataSourceOptions } from "typeorm";

export const databaseConfig = (): DataSourceOptions => ({
  name: "default",
  type: "postgres",
  logging: true,
  synchronize: true,
  ssl: false,
  dropSchema: false,
  entities: ["./dist/**/*.entity.js"],
  migrations: ["./dist/migrations/*.js"],
  database: get("DB_DATABASE").asString(),
  host: get("DB_HOST").asString(),
  username: get("DB_USERNAME").asString(),
  port: get("DB_PORT").asPortNumber(),
  password: get("DB_PASSWORD").asString(),
});

export default new DataSource(databaseConfig());

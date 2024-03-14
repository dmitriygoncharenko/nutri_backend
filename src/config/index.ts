import { auth0Config } from "./auth0.config";
import { databaseConfig } from "./database.config";
import { mailConfig } from "./mail.config";
import { redisConfig } from "./redis.config";
import { s3Config } from "./s3.config";
import { telegramConfig } from "./telegram.config";

export default () => ({
  databaseConfig: databaseConfig(),
  auth0Config: auth0Config(),
  mailConfig: mailConfig(),
  telegraphConfig: telegramConfig(),
  s3Config: s3Config(),
  redisConfig: redisConfig(),
});

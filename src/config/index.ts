import { auth0Config } from "./auth0.config";
import { databaseConfig } from "./database.config";
import { mailConfig } from "./mail.config";

export default () => ({
  databaseConfig: databaseConfig(),
  auth0Config: auth0Config(),
  mailConfig: mailConfig(),
});

import { auth0Config } from "./auth0.config";
import { databaseConfig } from "./database.config";
import { mailConfig } from "./mail.config";
import { telegraphConfig } from "./telegraph.config";

export default () => ({
  databaseConfig: databaseConfig(),
  auth0Config: auth0Config(),
  mailConfig: mailConfig(),
  telegraphConfig: telegraphConfig(),
});

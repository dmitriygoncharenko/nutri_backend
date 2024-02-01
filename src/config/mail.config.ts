import { get } from "env-var";

export const mailConfig = () => ({
  apikey: get("SENDGRID_API_KEY").asString(),
});

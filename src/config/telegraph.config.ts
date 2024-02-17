import { get } from "env-var";

export const telegraphConfig = () => ({
  accessToken: get("TELEGRAPH_ACCESS_TOKEN").asString(),
});

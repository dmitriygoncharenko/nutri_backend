import { get } from "env-var";

export const auth0Config = () => ({
  audience: get("AUTH0_AUDIENCE").asString(),
  domain: get("AUTH0_DOMAIN").asString(),
});

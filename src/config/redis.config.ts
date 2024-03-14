import { get } from "env-var";

export const redisConfig = () => ({
  host: get("REDIS_HOST").asString(),
  port: get("REDIS_PORT").asPortNumber(),
  username: get("REDIS_USERNAME").asString(),
  password: get("REDIS_PASSWORD").asString(),
});

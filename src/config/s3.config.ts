import { get } from "env-var";

export const s3Config = () => ({
  accessKeyId: get("S3_ACCESS_KEY_ID").asString(),
  secretAccessKey: get("S3_SECRET_ACCESS_KEY").asString(),
  endpoint: get("S3_ENDPOINT").asString(),
});

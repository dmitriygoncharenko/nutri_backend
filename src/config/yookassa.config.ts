import { get } from "env-var";

export const yookassaConfig = () => ({
  token: get("YOOKASSA_TOKEN").asString(),
  secretKey: get("YOOKASSA_SECRET").asString(),
  shopId: get("YOOKASSA_SHOPID").asString(),
});

import { get } from "env-var";

export const telegramConfig = () => ({
  telegraph: { accessToken: get("TELEGRAPH_ACCESS_TOKEN").asString() },
  telegram: { token: get("TELEGRAM_BOT_TOKEN").asString() },
});

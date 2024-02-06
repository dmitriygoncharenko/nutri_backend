import { get } from "env-var";

export const openaiConfig = () => ({
  apiKey: get("OPENAI_API_KEY").asString(),
  completionParams: {
    model: "gpt-4",
    temperature: 0.5,
    top_p: 0.8,
  },
});

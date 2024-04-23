import { get } from "env-var";

export const notionConfig = () => ({
  token: get("NOTION_TOKEN").asString(),
});

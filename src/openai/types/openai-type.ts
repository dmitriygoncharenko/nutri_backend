import { OpenAIAssistantRunStatusEnum } from "../enums/openai-assistant-run-status.enum";
import { Run } from "openai/resources/beta/threads/runs/runs";
export interface AssitantRun extends Run {
  status: OpenAIAssistantRunStatusEnum;
}

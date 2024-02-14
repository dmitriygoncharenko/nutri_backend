// src/openai/openai.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import {
  MessageCreateParams,
  ThreadMessagesPage,
} from "openai/resources/beta/threads/messages/messages";
import { Run } from "openai/resources/beta/threads/runs/runs";
import { openaiConfig } from "src/config/openai.config";

@Injectable()
export class OpenAIService {
  private openAi: OpenAI;
  private readonly logger = new Logger("Message");

  constructor() {
    this.openAi = new OpenAI(openaiConfig());
  }

  async test(): Promise<any> {
    try {
      const threadId = await this.createThread([]);
      await this.addThreadMessage(threadId, {
        role: "user",
        content:
          "Male, 34y.o., 90kg, 177cm, vegan, meals a day: breakfast, lunch, snack",
      });
      await this.addThreadMessage(threadId, {
        role: "user",
        content: "breakfast",
      });
      const run = await this.openAi.beta.threads.runs.create(threadId, {
        assistant_id: "asst_47w0IPJk5GxOtIHPIdyWPUry",
        model: "gpt-4-turbo-preview",
        tools: [{ type: "retrieval" }],
      });
      await this.checkRun(threadId, run.id);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async chatGPT(
    messages: ChatCompletionMessageParam[],
    userId?: string
  ): Promise<Record<string, string | number>> {
    try {
      const completion = await this.openAi.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: "Create answer in JSON format." },
          ...messages,
        ],
        user: userId || undefined,
        response_format: { type: "json_object" },
      });
      const response = completion.choices[0].message.content;
      console.log("🚀 ~ OpenAIService ~ response:", response);
      return JSON.parse(response);
    } catch (err) {
      this.logger.error(err);
    }
  }

  async createThread(messages: MessageCreateParams[]): Promise<string> {
    console.log("create thread", messages);
    const thread = await this.openAi.beta.threads.create({ messages });
    return thread.id;
  }

  async addThreadMessage(threadId: string, message: MessageCreateParams) {
    console.log("add message to thread");
    await this.openAi.beta.threads.messages.create(threadId, message);
  }

  async getThreadMessages(threadId: string): Promise<ThreadMessagesPage> {
    console.log("get messages from thread");
    return await this.openAi.beta.threads.messages.list(threadId);
  }

  async runAssistant(threadId: string, assistantId: string) {
    console.log("run assistant");
    return await this.openAi.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      model: "gpt-4-turbo-preview",
      tools: [{ type: "retrieval" }],
    });
  }

  async checkRun(threadId: string, runId: string): Promise<Run> {
    console.log("check run");
    return await this.openAi.beta.threads.runs.retrieve(threadId, runId);
  }
}

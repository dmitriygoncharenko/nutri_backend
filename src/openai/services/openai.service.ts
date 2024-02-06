// src/openai/openai.service.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { openaiConfig } from "src/config/openai.config";

@Injectable()
export class OpenAIService {
  private openAi: OpenAI;

  constructor() {
    this.openAi = new OpenAI(openaiConfig());
  }

  async generateResponse(prompt: string): Promise<string> {
    console.log("chat ai");
    try {
      const completion = await this.openAi.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "user", content: "Create random string for 10 letters." },
        ],
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error("Error calling the OpenAI API:", error);
      throw new Error("Failed to communicate with OpenAI API");
    }
  }
}

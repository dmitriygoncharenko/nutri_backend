import { Module } from "@nestjs/common";
import { OpenAiController } from "./controllers/openai.controller";
import { OpenAIService } from "./services/openai.service";

@Module({
  controllers: [OpenAiController],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAiModule {}

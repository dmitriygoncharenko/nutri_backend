import { Module } from "@nestjs/common";
import { OpenAiController } from "./controllers/openai.controller";
import { OpenAIService } from "./services/openai.service";
import { RestModule } from "src/rest/rest.module";

@Module({
  imports: [RestModule],
  controllers: [OpenAiController],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class OpenAiModule {}

import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OpenAIService } from "../services/openai.service";

@ApiTags("Open AI")
@Controller("openai")
export class OpenAiController {
  constructor(private readonly openaiService: OpenAIService) {}
  @Get()
  @ApiOperation({
    summary: "test ai",
  })
  @ApiResponse({ status: 200, description: "Success" })
  async testAi(): Promise<string> {
    return await this.openaiService.generateResponse("hello");
  }
}

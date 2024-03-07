import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Meal")
@Controller("meal")
export class MealController {
  constructor() {}
  @Get("test")
  @ApiOperation({
    summary: "test meal image generation",
  })
  @ApiResponse({ status: 200, description: "Success" })
  async test(): Promise<any> {
    return;
  }
}

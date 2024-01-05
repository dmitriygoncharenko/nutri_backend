import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QuestionGroupEntity } from "../entities/question-group.entity";
import { QuestionGroupService } from "../services/question-group.service";

@ApiTags("Question Groups")
@Controller("question/group")
export class QuestionGroupController {
  constructor(private readonly questionGroupService: QuestionGroupService) {}

  @Get(":groupId")
  @ApiOperation({ summary: "Get group with questions" })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: () => QuestionGroupEntity,
  })
  async getGroupById(@Param("groupId") id: string) {
    return await this.questionGroupService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Save question group" })
  @ApiResponse({
    status: 200,
    type: () => QuestionGroupEntity,
    description: "Success",
  })
  async save(@Body() body: QuestionGroupEntity) {
    return this.questionGroupService.save(body);
  }
}

import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QuestionEntity } from "../entities/question.entity";
import { QuestionService } from "../services/question.service";
import { UpdateResult } from "typeorm";

@ApiTags("Questionnaire Questions")
@Controller("question")
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(":questionId")
  @ApiOperation({ summary: "Get question by id" })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: () => QuestionEntity,
  })
  async getQuestion(@Param("questionId") id: string): Promise<QuestionEntity> {
    return await this.questionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Save question" })
  @ApiResponse({
    description: "Success",
    status: 200,
    type: () => QuestionEntity,
  })
  async save(@Body() body: QuestionEntity): Promise<QuestionEntity> {
    return await this.questionService.save(body);
  }

  @ApiOperation({ summary: "Delete question by id" })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: UpdateResult,
  })
  @Delete(":questionId")
  async delete(@Param("questionId") id: string): Promise<UpdateResult> {
    return await this.questionService.delete(id);
  }
}

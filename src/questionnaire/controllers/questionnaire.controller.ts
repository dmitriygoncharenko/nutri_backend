import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { QuestionnaireService } from "../services/questionnaire.service";
import { QuestionnaireEntity } from "../entities/questionnaire.entity";
import { QuestionnaireSaveDto } from "../dtos/questionnaire-save.dto";
import { QuestionnaireResponseDto } from "../dtos/questionnaire-response.dto";
import { UserQuestionnaireResponseEntity } from "src/user/entities/user-questionnaire-response.entity";
import { UserQuestionnaireResponseService } from "src/user/services/user-questionnaire-response.service";
import { UpdateResult } from "typeorm";

@ApiTags("Questionnaire")
@Controller("questionnaire")
export class QuestionnaireController {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly questionnaireResponseService: UserQuestionnaireResponseService
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get all questionnaire",
  })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: QuestionnaireEntity,
    isArray: true,
  })
  async getAll(): Promise<QuestionnaireEntity[]> {
    return await this.questionnaireService.findAll();
  }

  @Get(":questionnaireId")
  @ApiOperation({
    summary: "Get questionnaire by id",
  })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: QuestionnaireEntity,
  })
  async getQuestionnaireById(
    @Param("questionnaireId") id: string
  ): Promise<QuestionnaireEntity> {
    return await this.questionnaireService.findOne(id);
  }

  @Get(":questionnaireId/responses")
  @ApiOperation({ summary: "Get questionnaire responses" })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: UserQuestionnaireResponseEntity,
    isArray: true,
  })
  async getQuestionnaireResponses(@Param("questionnaireId") id: string) {
    return await this.questionnaireResponseService.getQuestionnaireResponses(
      id
    );
  }

  @Post("save")
  @ApiOperation({ summary: "Create or update questionnaire" })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: QuestionnaireEntity,
    isArray: true,
  })
  async save(@Body() body: QuestionnaireSaveDto): Promise<QuestionnaireEntity> {
    return await this.questionnaireService.save(body);
  }

  @ApiOperation({ summary: "Delete questionnaire by id" })
  @ApiResponse({
    status: 200,
    description: "Success",
    type: UpdateResult,
  })
  @Delete(":questionnaireId")
  async delete(@Param("questionnaireId") id: string): Promise<UpdateResult> {
    return await this.questionnaireService.delete(id);
  }
}

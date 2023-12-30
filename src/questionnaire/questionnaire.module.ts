import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionEntity } from "./entities/question.entity";
import { QuestionGroupEntity } from "./entities/question-group.entity";
import { QuestionnaireEntity } from "./entities/questionnaire.entity";
import { QuestionGradeEntity } from "./entities/question-grade.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionGroupEntity,
      QuestionnaireEntity,
      QuestionGradeEntity,
    ]),
  ],
})
export class QuestionnaireModule {}

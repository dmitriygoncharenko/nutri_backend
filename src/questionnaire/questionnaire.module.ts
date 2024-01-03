import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuestionEntity } from "./entities/question.entity";
import { QuestionGroupEntity } from "./entities/question-group.entity";
import { QuestionnaireEntity } from "./entities/questionnaire.entity";
import { QuestionGradeEntity } from "./entities/question-grade.entity";
import { QuestionnaireController } from "./controllers/questionnaire.controller";
import { QuestionnaireService } from "./services/questionnaire.service";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionEntity,
      QuestionGroupEntity,
      QuestionnaireEntity,
      QuestionGradeEntity,
    ]),
    UserModule,
  ],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService],
})
export class QuestionnaireModule {}

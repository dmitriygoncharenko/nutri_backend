import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserCoachProfileEntity } from "./entities/user-coach-profile.entity";
import { UsereHealthProblemEntity } from "./entities/user-health-problem.entity";
import { UserHeightEntity } from "./entities/user-height.entity";
import { UserWeightEntity } from "./entities/user-weight.entity";
import { UserHrzoneEntity } from "./entities/user-hrzone.entity";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { UserQuestionnaireAnswerEntity } from "./entities/user-questionnaire-answer.entity";
import { UserQuestionnaireResponseEntity } from "./entities/user-questionnaire-response.entity";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserCoachProfileEntity,
      UsereHealthProblemEntity,
      UserHeightEntity,
      UserWeightEntity,
      UserHrzoneEntity,
      UserProfileEntity,
      UserQuestionnaireAnswerEntity,
      UserQuestionnaireResponseEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

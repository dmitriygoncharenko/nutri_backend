import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserCoachProfileEntity } from "./entities/user-coach-profile.entity";
import { UserHealthProblemEntity } from "./entities/user-health-problem.entity";
import { UserHeightEntity } from "./entities/user-height.entity";
import { UserWeightEntity } from "./entities/user-weight.entity";
import { UserHrzoneEntity } from "./entities/user-hrzone.entity";
import { UserProfileEntity } from "./entities/user-profile.entity";
import { UserQuestionnaireAnswerEntity } from "./entities/user-questionnaire-answer.entity";
import { UserQuestionnaireResponseEntity } from "./entities/user-questionnaire-response.entity";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { UserQuestionnaireResponseService } from "./services/user-questionnaire-response.service";
import { AuthModule } from "src/auth/auth.module";
import { HttpModule } from "@nestjs/axios";
import { UserProfileService } from "./services/user-profile.service";
import { UserWeightService } from "./services/user-weight.service";
import { UserHeightService } from "./services/user-height.service";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      UserEntity,
      UserCoachProfileEntity,
      UserHealthProblemEntity,
      UserHeightEntity,
      UserWeightEntity,
      UserHrzoneEntity,
      UserProfileEntity,
      UserQuestionnaireAnswerEntity,
      UserQuestionnaireResponseEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserQuestionnaireResponseService,
    UserProfileService,
    UserWeightService,
    UserHeightService,
  ],
  exports: [
    UserService,
    UserQuestionnaireResponseService,
    UserProfileService,
    UserWeightService,
    UserHeightService,
  ],
})
export class UserModule {}

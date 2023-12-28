import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AnalysisModule } from "src/analysis/analysis.module";
import { DiaryModule } from "src/diary/diary.module";
import { NotificationModule } from "src/notification/notification.module";
import { TrainingModule } from "src/training/training.module";
import { QuestionnaireModule } from "src/questionnaire/questionnaire.module";
import { UserModule } from "src/user/user.module";
import { HmatrixModule } from "src/hmatrix/hmatrix.module";

@Module({
  imports: [
    AnalysisModule,
    DiaryModule,
    NotificationModule,
    TrainingModule,
    QuestionnaireModule,
    UserModule,
    HmatrixModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

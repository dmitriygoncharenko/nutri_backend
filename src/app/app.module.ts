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
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "src/config/database.config";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";
import config from "../config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      expandVariables: true,
    }),
    // DATABASE
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...databaseConfig(),
        autoLoadEntities: true,
      }),
      // cli: {
      //   migrationsDir: "src/migrations",
      //   entitiesDir: "src/**/entities/*.ts",
      // },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error("Invalid options passed");
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
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

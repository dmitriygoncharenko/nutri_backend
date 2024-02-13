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
import { mailConfig } from "src/config/mail.config";
import { addTransactionalDataSource } from "typeorm-transactional";
import { DataSource } from "typeorm";
import { AuthModule } from "src/auth/auth.module";
import { TelegramModule } from "src/telegram/telegram.module";
import { SendGridModule } from "@anchan828/nest-sendgrid";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { OpenAiModule } from "src/openai/openai.module";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { MealModule } from "src/meal/meal.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
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
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error("Invalid options passed");
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    SendGridModule.forRootAsync({
      useFactory: async () => ({
        ...mailConfig(),
      }),
    }),
    AuthModule,
    AnalysisModule,
    DiaryModule,
    NotificationModule,
    TrainingModule,
    QuestionnaireModule,
    UserModule,
    HmatrixModule,
    TelegramModule,
    OpenAiModule,
    SubscriptionModule,
    MealModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

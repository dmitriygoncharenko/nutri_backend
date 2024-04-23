import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserModule } from "src/user/user.module";
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
import { RestModule } from "src/rest/rest.module";
import { S3Module } from "src/s3/s3.module";
import { BullModule } from "@nestjs/bullmq";
import { QueueModule } from "src/queue/queue.module";
import { redisConfig } from "src/config/redis.config";
import {NotionModule} from "../notion/notion.module";

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
    BullModule.forRoot({
      connection: {
        ...redisConfig(),
      },
    }),
    AuthModule,
    QueueModule,
    UserModule,
    TelegramModule,
    OpenAiModule,
    SubscriptionModule,
    MealModule,
    RestModule,
    S3Module,
    NotionModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

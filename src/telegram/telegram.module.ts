import { NestjsGrammyModule } from "@grammyjs/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { TelegramCron } from "./telegram.cron";
import { TelegramUpdate } from "./telegram.update";
import { TelegramFlowService } from "./flows/telegram-flow.service";
import { TelegramStartFlowService } from "./flows/telegram-start-flow.service";
import { TelegramRecipeFlowService } from "./flows/telegram-recipe-flow.service";
import { TelegramWeightFlowService } from "./flows/telegram-weight-flow.service";
import { TelegramPayFlowService } from "./flows/telegram-pay-flow.service";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { OpenAiModule } from "src/openai/openai.module";

@Module({
  imports: [
    // MODULES
    UserModule,
    SubscriptionModule,
    OpenAiModule,
    // GRAMMY
    NestjsGrammyModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token:
          configService.get("TELEGRAM_BOT_TOKEN") ||
          "6023947364:AAG6r3pccWTbCKTQWMasE4aT0gaazCUNWx4",
        // , // nutrilab
        // '6177188168:AAEQxK2bsAMRXk0a0TwnWaAudGYdPeyRu2I', //TODO env
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TelegramUpdate,
    TelegramRecipeFlowService,
    TelegramStartFlowService,
    TelegramFlowService,
    TelegramWeightFlowService,
    TelegramPayFlowService,
  ],
  exports: [
    TelegramUpdate,
    TelegramStartFlowService,
    TelegramFlowService,
    TelegramRecipeFlowService,
    TelegramWeightFlowService,
    TelegramPayFlowService,
  ],
})
export class TelegramModule {}

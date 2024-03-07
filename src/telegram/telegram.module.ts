import { NestjsGrammyModule } from "@grammyjs/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { TelegramUpdate } from "./services/telegram.update";
import { TelegramFlowService } from "./flows/telegram-flow.service";
import { TelegramStartFlowService } from "./flows/telegram-start-flow.service";
import { TelegramRecipeFlowService } from "./flows/telegram-recipe-flow.service";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { OpenAiModule } from "src/openai/openai.module";
import { TelegraphService } from "./services/telegraph.service";
import { RestModule } from "src/rest/rest.module";
import { telegramConfig } from "src/config/telegram.config";
import { TelegramService } from "./services/telegram.service";
import { BullModule } from "@nestjs/bullmq";
import { SubscriptionQueueEnum } from "src/queue/enums/subscription-queue.enum";

@Module({
  imports: [
    // MODULES
    UserModule,
    SubscriptionModule,
    OpenAiModule,
    RestModule,
    NestjsGrammyModule.forRoot(telegramConfig().telegram),
    BullModule.registerQueue({
      name: SubscriptionQueueEnum.SUBSCRIPTION_PAYMENT_QUEUE,
    }),
  ],
  providers: [
    TelegramUpdate,
    TelegramRecipeFlowService,
    TelegramStartFlowService,
    TelegramFlowService,
    TelegraphService,
    TelegramService,
  ],
  exports: [
    TelegramUpdate,
    TelegramStartFlowService,
    TelegramFlowService,
    TelegramRecipeFlowService,
    TelegraphService,
    TelegramService,
  ],
})
export class TelegramModule {}

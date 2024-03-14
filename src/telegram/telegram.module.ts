import { NestjsGrammyModule } from "@grammyjs/nestjs";
import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { TelegramUpdate } from "./services/telegram.update";
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
import { TypeOrmModule } from "@nestjs/typeorm";
import { BotMessageEntity } from "./entities/bot-message.entity";

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
    TypeOrmModule.forFeature([BotMessageEntity]),
  ],
  providers: [
    TelegramUpdate,
    TelegramRecipeFlowService,
    TelegramStartFlowService,
    TelegraphService,
    TelegramService,
  ],
  exports: [
    TelegramUpdate,
    TelegramStartFlowService,
    TelegramRecipeFlowService,
    TelegraphService,
    TelegramService,
  ],
})
export class TelegramModule {}

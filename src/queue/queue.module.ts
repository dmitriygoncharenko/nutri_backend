import { Module, forwardRef } from "@nestjs/common";
import { OpenAiModule } from "src/openai/openai.module";
import { S3Module } from "src/s3/s3.module";
import { BullModule } from "@nestjs/bullmq";
import { MealQueueEnum } from "./enums/meal-queue.enum";
import { MealDayProcessor } from "../queue/processors/meal-day-processor";
import { MealRunProcessor } from "../queue/processors/meal-run.processor";
import { MealDayIngredientsProcessor } from "../queue/processors/meal-day-ingredients.processor";
import { MealWeekIngredientsProcessor } from "../queue/processors/meal-week-ingredients.processor";
import { MealSendProcessor } from "../queue/processors/meal-send.processor";
import { TelegramModule } from "src/telegram/telegram.module";
import { MealModule } from "src/meal/meal.module";
import { MealWeekIngredientsSendProcessor } from "./processors/meal-week-ingredients-send.processor";
import { UserModule } from "src/user/user.module";
import { SubscriptionQueueEnum } from "./enums/subscription-queue.enum";
import { SubscriptionPaymentProcessor } from "./processors/subscription-payment.processor";
import { SubscriptionProcessor } from "./processors/subscription.processor";
import { SubscriptionModule } from "src/subscription/subscription.module";
import {NotionModule} from "../notion/notion.module";

@Module({
  imports: [
    BullModule.registerQueue(
      { name: MealQueueEnum.MEAL_QUEUE },
      { name: MealQueueEnum.MEAL_DAY_QUEUE },
      { name: MealQueueEnum.MEAL_DAY_INGREDIENTS_QUEUE },
      { name: MealQueueEnum.MEAL_WEEK_INGREDIENTS_QUEUE },
      { name: MealQueueEnum.MEAL_WEEK_INGREDIENTS_SEND_QUEUE },
      { name: MealQueueEnum.MEAL_SEND_QUEUE },
      { name: SubscriptionQueueEnum.SUBSCRIPTION_QUEUE },
      { name: SubscriptionQueueEnum.SUBSCRIPTION_PAYMENT_QUEUE }
    ),
    UserModule,
    OpenAiModule,
    TelegramModule,
    SubscriptionModule,
    S3Module,
    MealModule,
    NotionModule
  ],
  providers: [
    MealDayProcessor,
    MealRunProcessor,
    MealDayIngredientsProcessor,
    MealWeekIngredientsProcessor,
    MealSendProcessor,
    MealWeekIngredientsSendProcessor,
    SubscriptionProcessor,
    SubscriptionPaymentProcessor,
  ],
  exports: [
    MealDayProcessor,
    MealRunProcessor,
    MealDayIngredientsProcessor,
    MealWeekIngredientsProcessor,
    MealSendProcessor,
    MealWeekIngredientsSendProcessor,
    SubscriptionProcessor,
    SubscriptionPaymentProcessor,
  ],
})
export class QueueModule {}

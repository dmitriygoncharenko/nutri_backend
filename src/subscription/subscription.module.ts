import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { SubscriptionService } from "./services/subscription.service";
import { BullModule } from "@nestjs/bullmq";
import { SubscriptionQueueEnum } from "../queue/enums/subscription-queue.enum";
import { SubscriptionProcessor } from "../queue/processors/subscription.processor";
import { UserModule } from "src/user/user.module";
import { OpenAiModule } from "src/openai/openai.module";
import { MealModule } from "src/meal/meal.module";
import { MealQueueEnum } from "src/queue/enums/meal-queue.enum";
import { QueueModule } from "src/queue/queue.module";
import { YookassaService } from "./services/yookassa.service";
import { RestModule } from "src/rest/rest.module";
import { YooCheckout } from "@a2seven/yoo-checkout";
import { SubscriptionYookassaController } from "./controllers/subscription-yookassa.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionEntity]),

    // TODO not sure if I need it here
    BullModule.registerQueue(
      {
        name: SubscriptionQueueEnum.SUBSCRIPTION_QUEUE,
      },
      {
        name: MealQueueEnum.MEAL_DAY_QUEUE,
      }
    ),

    UserModule,
    OpenAiModule,
    MealModule,
    RestModule,
  ],
  controllers: [SubscriptionYookassaController],
  providers: [SubscriptionService, YookassaService],
  exports: [SubscriptionService, YookassaService],
})
export class SubscriptionModule {}

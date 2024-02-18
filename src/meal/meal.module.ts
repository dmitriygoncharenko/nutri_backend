import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealEntity } from "./entities/meal.entity";
import { MealGenerateCron } from "./services/meal.cron";
import { UserModule } from "src/user/user.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { MealService } from "./services/meal.service";
import { OpenAiModule } from "src/openai/openai.module";
import { MealGroupService } from "./services/meal-group.service";
import { MealGroupEntity } from "./entities/meal-group.entity";
import { TelegramModule } from "src/telegram/telegram.module";

@Module({
  imports: [
    UserModule,
    SubscriptionModule,
    OpenAiModule,
    TelegramModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([MealEntity, MealGroupEntity]),
  ],
  providers: [MealGenerateCron, MealService, MealGroupService],
  exports: [MealService],
})
export class MealModule {}

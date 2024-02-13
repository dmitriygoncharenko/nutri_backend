import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealEntity } from "./entities/meal.entity";
import { MealGenerateCron } from "./services/meal-generate.service";
import { UserModule } from "src/user/user.module";
import { ScheduleModule } from "@nestjs/schedule";
import { SubscriptionModule } from "src/subscription/subscription.module";
import { MealService } from "./services/meal.service";
import { OpenAiModule } from "src/openai/openai.module";

@Module({
  imports: [
    UserModule,
    SubscriptionModule,
    OpenAiModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([MealEntity]),
  ],
  providers: [MealGenerateCron, MealService],
  exports: [MealService],
})
export class MealModule {}

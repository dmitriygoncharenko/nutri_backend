import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealEntity } from "./entities/meal.entity";
import { MealDayEntity } from "./entities/meal-day.entity";
import { MealController } from "./controllers/meal.controller";
import { MealWeekEntity } from "./entities/meal-week.entity";
import { MealService } from "./services/meal.service";
import { MealDayService } from "./services/meal-day.service";
import { MealWeekService } from "./services/meal-week.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([MealWeekEntity, MealDayEntity, MealEntity]),
  ],
  controllers: [MealController],
  providers: [MealService, MealDayService, MealWeekService],
  exports: [MealService, MealDayService, MealWeekService],
})
export class MealModule {}

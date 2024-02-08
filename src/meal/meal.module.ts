import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MealEntity } from "./entities/meal.entity";
import { MealGroupEntity } from "./entities/meal-group.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MealEntity, MealGroupEntity])],
})
export class MealModule {}

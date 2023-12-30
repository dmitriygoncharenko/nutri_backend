import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DiaryFoodEntity } from "./entities/diary-food.entity";
import { DiaryWaterEntity } from "./entities/diary-water.entity";
import { DiaryEntity } from "./entities/diary.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryFoodEntity, DiaryWaterEntity, DiaryEntity]),
  ],
})
export class DiaryModule {}

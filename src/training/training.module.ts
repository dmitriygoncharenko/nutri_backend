import { Module } from "@nestjs/common";
import { TrainingEntity } from "./entities/training.entity";
import { TrainingTypeEntity } from "./entities/training-type.entity";
import { TrainingPlanEntity } from "./entities/training-plan.entity";

@Module({
  imports: [TrainingEntity, TrainingTypeEntity, TrainingPlanEntity],
})
export class TrainingModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnalysisEntity } from "./entities/analysis.entity";
import { AnalysisValueEntity } from "./entities/analysis-value.entity";

@Module({
  imports: [TypeOrmModule.forFeature([AnalysisEntity, AnalysisValueEntity])],
})
export class AnalysisModule {}

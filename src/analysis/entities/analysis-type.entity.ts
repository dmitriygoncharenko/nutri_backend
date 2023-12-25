import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { AnalysisEntity } from "./analysis.entity";

@Entity("analysis_types")
export class AnalysisTypeEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @OneToMany(() => AnalysisEntity, (entity) => entity.analysisType, {
    cascade: true,
    onDelete: "CASCADE",
  })
  analysis: AnalysisEntity[];
}

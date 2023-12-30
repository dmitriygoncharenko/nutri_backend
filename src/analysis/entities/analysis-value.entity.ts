import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AnalysisEntity } from "./analysis.entity";

const nullable = true;
@Entity("analysis_values")
export class AnalysisValueEntity extends AbstractEntity {
  @Column({ type: "decimal", nullable })
  value?: number;

  @Column({ type: "text", nullable })
  description?: string;

  @Column({ type: "timestamptz", nullable })
  date?: Date;

  @Column({ type: "uuid" })
  analysisId: string;

  @ManyToOne(() => AnalysisEntity, (entity) => entity.values)
  @JoinColumn({ name: "analysisId", referencedColumnName: "id" })
  analysis: AnalysisEntity;
}

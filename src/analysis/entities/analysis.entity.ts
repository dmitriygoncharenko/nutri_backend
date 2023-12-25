import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AnalysisTypeEntity } from "./analysis-type.entity";

const nullable: boolean = true;

@Entity("analysis")
export class AnalysisEntity extends AbstractEntity {
  @Column({ type: "decimal", nullable })
  value?: number;

  @Column({ type: "text", nullable })
  description?: string;

  @Column({ type: "timestamptz", nullable })
  date?: Date;

  @Column({ type: "uuid" })
  userId: string;

  @Column({ type: "uuid" })
  analysisTypeId: string;

  @ManyToOne(() => UserEntity, (user) => user.analysis)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;

  @ManyToOne(() => AnalysisTypeEntity, (entity) => entity.analysis)
  @JoinColumn({ name: "analysisTypeId", referencedColumnName: "id" })
  analysisType: AnalysisTypeEntity;
}

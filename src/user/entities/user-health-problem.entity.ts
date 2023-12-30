import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { UserQuestionnaireResponseEntity } from "./user-questionnaire-response.entity";
import { UserEntity } from "./user.entity";

@Entity("user_health_problems")
export class UsereHealthProblemEntity extends AbstractEntity {
  @Column({ type: "text" })
  description: string;

  @Column({ type: "boolean", default: false })
  skipped: boolean;

  @Column({ type: "boolean", default: false })
  isAI: boolean;

  @Column({ type: "uuid", nullable: true })
  creatorId?: string;

  @ManyToOne(() => UserEntity, (entity) => entity.creatorAnalysis)
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  creator: UserEntity;

  @Column({ type: "uuid" })
  responseId: string;

  @ManyToOne(() => UserQuestionnaireResponseEntity, (entity) => entity.analysis)
  @JoinColumn({ name: "responseId", referencedColumnName: "id" })
  response: UserQuestionnaireResponseEntity;
}

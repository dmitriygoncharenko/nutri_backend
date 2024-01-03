import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { UserQuestionnaireResponseEntity } from "./user-questionnaire-response.entity";
import { UserEntity } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";
import {
  ApiPropertyBoolean,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";

@Entity("user_health_problems")
export class UserHealthProblemEntity extends AbstractEntity {
  @ApiPropertyString()
  @Column({ type: "text" })
  description: string;

  @ApiPropertyBoolean()
  @Column({ type: "boolean", default: false })
  skipped: boolean;

  @ApiPropertyBoolean()
  @Column({ type: "boolean", default: false })
  isAI: boolean;

  @ApiPropertyId()
  @Column({ type: "uuid", nullable: true })
  creatorId?: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (entity) => entity.creatorAnalysis)
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  creator: UserEntity;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  responseId: string;

  @ManyToOne(() => UserQuestionnaireResponseEntity, (entity) => entity.analysis)
  @JoinColumn({ name: "responseId", referencedColumnName: "id" })
  response: UserQuestionnaireResponseEntity;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { UserQuestionnaireAnswerEntity } from "./user-questionnaire-answer.entity";
import { QuestionnaireEntity } from "src/questionnaire/entities/questionnaire.entity";
import { UserHealthProblemEntity } from "./user-health-problem.entity";
import { UserEntity } from "./user.entity";
import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { ApiPropertyString } from "src/shared/decorators/api.decorator";
import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";

@Entity("user_questionnaire_responses")
export class UserQuestionnaireResponseEntity extends AbstractEntity {
  @ApiPropertyId()
  @Column({ type: "uuid" })
  questionnaireId: string;

  @ManyToOne(() => QuestionnaireEntity, (entity) => entity.responses)
  @JoinColumn({ name: "questionnaireId" })
  questionnaire: QuestionnaireEntity;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({ type: () => UserQuestionnaireAnswerEntity, isArray: true })
  @OneToMany(() => UserQuestionnaireAnswerEntity, (entity) => entity.response, {
    cascade: true,
    onDelete: "CASCADE",
  })
  answers: UserQuestionnaireAnswerEntity[];

  @ApiProperty({ type: () => UserHealthProblemEntity, isArray: true })
  @OneToMany(() => UserHealthProblemEntity, (entity) => entity.response, {
    cascade: true,
    onDelete: "CASCADE",
  })
  analysis: UserHealthProblemEntity[];
}

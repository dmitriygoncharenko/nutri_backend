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
import { UsereHealthProblemEntity } from "./user-health-problem.entity";
import { UserEntity } from "./user.entity";
import { AbstractEntity } from "src/shared/entities/abstract.entity";

@Entity("user_questionnaire_responses")
export class UserQuestionnaireResponseEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  questionnaireId: string;

  @ManyToOne(() => QuestionnaireEntity, (entity) => entity.responses)
  @JoinColumn({ name: "questionnaireId", referencedColumnName: "id" })
  questionnaire: QuestionnaireEntity;

  @Column({ type: "uuid" })
  userId: string;

  @OneToMany(() => UserQuestionnaireAnswerEntity, (entity) => entity.response, {
    cascade: true,
    onDelete: "CASCADE",
  })
  answers: UserQuestionnaireAnswerEntity[];

  @OneToMany(() => UsereHealthProblemEntity, (entity) => entity.response, {
    cascade: true,
    onDelete: "CASCADE",
  })
  analysis: UsereHealthProblemEntity[];
}

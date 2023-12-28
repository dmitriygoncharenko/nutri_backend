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
import { UserQuestionnaireResponseAnalysisEntity } from "./user-questionnaire-response-analysis.entity";
import { UserEntity } from "./user.entity";

@Entity("user_questionnaire_responses")
export class UserQuestionnaireResponseEntity {
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

  @OneToMany(
    () => UserQuestionnaireResponseAnalysisEntity,
    (entity) => entity.response,
    {
      cascade: true,
      onDelete: "CASCADE",
    }
  )
  analysis: UserQuestionnaireResponseAnalysisEntity[];
}

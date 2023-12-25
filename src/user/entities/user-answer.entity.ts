import { QuestionEntity } from "src/questionnaire/entities/question.entity";
import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column } from "typeorm";

export class UserAnswerEntity extends AbstractEntity {
  userId: string;
  questionId: QuestionEntity;
  @Column({ type: "text" })
  answer: string;
}

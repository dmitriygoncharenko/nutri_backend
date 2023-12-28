import { QuestionEntity } from "src/questionnaire/entities/question.entity";
import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { QuestionTypeEnum } from "src/questionnaire/enums/question-type.enum";
import { BadRequestException } from "@nestjs/common";
import { UserQuestionnaireResponseEntity } from "./user-questionnaire-response.entity";

@Entity("user_questionnaire_answers")
export class UserQuestionnaireAnswerEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.answers)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;

  @Column({ type: "uuid" })
  questionId: string;

  @ManyToOne(() => QuestionEntity, (entity) => entity.answers)
  @JoinColumn({ name: "questionId", referencedColumnName: "id" })
  question: QuestionEntity;

  @Column({ type: "text", nullable: true })
  answer?: string;

  @Column({ type: "decimal", nullable: true })
  grade?: number;

  @Column({ type: "uuid" })
  responseId: string;

  @ManyToOne(() => UserQuestionnaireResponseEntity, (entity) => entity.answers)
  @JoinColumn({ name: "responseId", referencedColumnName: "id" })
  response: UserQuestionnaireResponseEntity;

  // check if grade is setup for question type with grade
  @BeforeInsert()
  checkQuestionType() {
    if (
      [QuestionTypeEnum.GRADE, QuestionTypeEnum.YESNO].includes(
        this.question.type
      ) &&
      !this.grade
    ) {
      throw new BadRequestException({
        message: `Grade is required for type ${this.question.type}`,
      });
    }
  }
}

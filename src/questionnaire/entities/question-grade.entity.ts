import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { QuestionEntity } from "./question.entity";

@Entity("question_grades")
export class QuestionGradeEntity extends AbstractEntity {
  @Column({ type: "text" }) // field to store grade description
  answer: string;

  @Column({ type: "decimal" })
  grade: number;

  @Column({ type: "text" })
  questionId: string;

  @ManyToOne(() => QuestionEntity, (entity) => entity.grades)
  @JoinColumn({ name: "questionId", referencedColumnName: "id" })
  question: QuestionEntity;
}

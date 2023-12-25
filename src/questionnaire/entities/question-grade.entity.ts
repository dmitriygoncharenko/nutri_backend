import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { QuestionEntity } from "./question.entity";

@Entity("question_grades")
export class QuestionGradeEntity extends AbstractEntity {
  @Column({ type: "text" })
  questionId: string;

  @Column({ type: "text" })
  caption: string;

  @Column({ type: "int" })
  grade: number;

  @ManyToOne(() => QuestionEntity, (entity) => entity.grades, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "questionId", referencedColumnName: "id" })
  question: QuestionEntity;
}

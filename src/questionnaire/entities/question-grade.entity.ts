import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { QuestionEntity } from "./question.entity";
import {
  ApiPropertyOptionalInt,
  ApiPropertyOptionalString,
} from "src/shared/decorators/api.decorator";
import { ApiPropertyOptionalId } from "src/shared/decorators/uuid.decorator";

@Entity("question_grades")
export class QuestionGradeEntity extends AbstractEntity {
  @ApiPropertyOptionalString()
  @Column({ type: "text" }) // field to store grade description
  answer: string;

  @ApiPropertyOptionalInt()
  @Column({ type: "decimal" })
  grade: number;

  @ApiPropertyOptionalId()
  @Column({ type: "text" })
  questionId: string;

  @ManyToOne(() => QuestionEntity, (entity) => entity.grades)
  @JoinColumn({ name: "questionId" })
  question: QuestionEntity;
}

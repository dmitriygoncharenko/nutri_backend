import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { QuestionGroupEntity } from "./question-group.entity";
import { QuestionTypeEnum } from "../enums/question-type.enum";
import { QuestionGradeEntity } from "./question-grade.entity";

@Entity("questions")
export class QuestionEntity extends AbstractEntity {
  @Column({ type: "text" })
  text: string;

  @Column({ type: "text" })
  description: string;

  type: QuestionTypeEnum;

  @Column({ type: "uuid" })
  groupId: string;

  @ManyToOne(() => QuestionGroupEntity, (entity) => entity.questions)
  @JoinColumn({ name: "groupId", referencedColumnName: "id" })
  group: QuestionGroupEntity;

  @OneToMany(() => QuestionGradeEntity, (entity) => entity.question, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({})
  grades: QuestionGradeEntity[];
}

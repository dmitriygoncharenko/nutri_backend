import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { QuestionEntity } from "./question.entity";
import { QuestionnaireEntity } from "./questionnaire.entity";

const nullable: boolean = true;

@Entity("question_groups")
export class QuestionGroupEntity extends AbstractEntity {
  @Column({ type: "text", nullable })
  caption: string;

  @Column({ type: "uuid" })
  questionnaireId: string;

  @OneToMany(() => QuestionEntity, (entity) => entity.group, {
    cascade: true,
    onDelete: "CASCADE",
  })
  questions: QuestionEntity[];

  @ManyToOne(() => QuestionnaireEntity, (entity) => entity.groups)
  @JoinColumn({ name: "questionnaireId", referencedColumnName: "id" })
  questionnaire: QuestionnaireEntity;
}

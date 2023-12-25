import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { QuestionGroupEntity } from "./question-group.entity";

@Entity("questionnaires")
export class QuestionnaireEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @OneToMany(() => QuestionGroupEntity, (entity) => entity.questionnaire, {
    cascade: true,
    onDelete: "CASCADE",
  })
  groups: QuestionGroupEntity[];
}

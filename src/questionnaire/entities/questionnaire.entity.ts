import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { QuestionGroupEntity } from "./question-group.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { UserQuestionnaireResponseEntity } from "src/user/entities/user-questionnaire-response.entity";

@Entity("questionnaires")
export class QuestionnaireEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @OneToMany(() => QuestionGroupEntity, (entity) => entity.questionnaire, {
    cascade: true,
    onDelete: "CASCADE",
  })
  groups: QuestionGroupEntity[];

  // @ManyToMany(() => UserEntity, (entity) => entity.questionnaires)
  // @JoinTable()
  // users: UserEntity[];

  @OneToMany(
    () => UserQuestionnaireResponseEntity,
    (entity) => entity.questionnaire,
    { cascade: true, onDelete: "CASCADE" }
  )
  responses: UserQuestionnaireResponseEntity[];
}

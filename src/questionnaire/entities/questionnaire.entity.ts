import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { QuestionGroupEntity } from "./question-group.entity";
import { UserQuestionnaireResponseEntity } from "src/user/entities/user-questionnaire-response.entity";
import { ApiPropertyOptionalString } from "src/shared/decorators/api.decorator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("questionnaires")
export class QuestionnaireEntity extends AbstractEntity {
  @ApiPropertyOptionalString()
  @Column({ type: "text" })
  caption: string;

  @ApiProperty({ type: () => QuestionGroupEntity, isArray: true })
  @OneToMany(() => QuestionGroupEntity, (entity) => entity.questionnaire, {
    cascade: true,
    onDelete: "CASCADE",
  })
  groups: QuestionGroupEntity[];

  @OneToMany(
    () => UserQuestionnaireResponseEntity,
    (entity) => entity.questionnaire,
    { cascade: true, onDelete: "CASCADE" }
  )
  responses: UserQuestionnaireResponseEntity[];
}

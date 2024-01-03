import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { QuestionEntity } from "./question.entity";
import { QuestionnaireEntity } from "./questionnaire.entity";
import {
  ApiPropertyOptionalString,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";
import {
  ApiPropertyId,
  ApiPropertyOptionalId,
} from "src/shared/decorators/uuid.decorator";

const nullable: boolean = true;

@Entity("question_groups")
export class QuestionGroupEntity extends AbstractEntity {
  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  caption: string;

  @ApiPropertyOptionalId()
  @Column({ type: "uuid" })
  questionnaireId: string;

  @ManyToOne(() => QuestionnaireEntity, (entity) => entity.groups)
  @JoinColumn({ name: "questionnaireId", referencedColumnName: "id" })
  questionnaire: QuestionnaireEntity;

  @OneToMany(() => QuestionEntity, (entity) => entity.group, {
    cascade: true,
    onDelete: "CASCADE",
  })
  questions: QuestionEntity[];
}

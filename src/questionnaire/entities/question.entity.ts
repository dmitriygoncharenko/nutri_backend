import { AbstractEntity } from "src/shared/entities/abstract.entity";
import {
  Column,
  Entity,
  IsNull,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { QuestionGroupEntity } from "./question-group.entity";
import { QuestionTypeEnum } from "../enums/question-type.enum";
import { QuestionGradeEntity } from "./question-grade.entity";
import { UserQuestionnaireAnswerEntity } from "src/user/entities/user-questionnaire-answer.entity";
import {
  ApiPropertyEnum,
  ApiPropertyOptionalEnum,
  ApiPropertyOptionalString,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";
import { IsEnum, IsOptional } from "class-validator";
import { ApiPropertyOptionalId } from "src/shared/decorators/uuid.decorator";
import { ApiProperty } from "@nestjs/swagger";

@Entity("questions")
export class QuestionEntity extends AbstractEntity {
  @ApiProperty({ type: "string", nullable: true })
  @Column({ type: "text" })
  caption: string;

  @ApiProperty({ type: "string", nullable: true })
  @Column({ type: "text", nullable: true })
  description?: string;

  @ApiProperty({
    enum: QuestionTypeEnum,
    enumName: "QuestionTypeEnum",
    example: QuestionTypeEnum.FREETEXT,
    nullable: true,
    type: () => QuestionTypeEnum,
  })
  @Column({
    type: "enum",
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.FREETEXT,
  })
  type: QuestionTypeEnum;

  @ApiPropertyOptionalId()
  @Column({ type: "uuid" })
  groupId: string;

  @ManyToOne(() => QuestionGroupEntity, (entity) => entity.questions)
  @JoinColumn({ name: "groupId" })
  group: QuestionGroupEntity;

  @ApiProperty({ type: () => QuestionGradeEntity, isArray: true })
  @IsOptional()
  @OneToMany(() => QuestionGradeEntity, (entity) => entity.question, {
    cascade: true,
    onDelete: "CASCADE",
  })
  grades: QuestionGradeEntity[];

  @OneToMany(() => UserQuestionnaireAnswerEntity, (entity) => entity.question, {
    cascade: true,
    onDelete: "CASCADE",
  })
  answers: UserQuestionnaireAnswerEntity[];
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { UserWeightEntity } from "./user-weight.entity";
import { AnalysisEntity } from "src/analysis/entities/analysis.entity";
import { UserHeightEntity } from "./user-height.entity";
import { NotificationEntity } from "src/notification/entities/notification.entity";
import { UserQuestionnaireAnswerEntity } from "./user-questionnaire-answer.entity";
import { DiaryEntity } from "src/diary/entities/diary.entity";
import { UserHrzoneEntity } from "./user-hrzone.entity";
import { TrainingPlanEntity } from "src/training/entities/training-plan.entity";
import { UserCoachProfileEntity } from "./user-coach-profile.entity";
import { QuestionnaireEntity } from "src/questionnaire/entities/questionnaire.entity";
import { UserHealthProblemEntity } from "./user-health-problem.entity";
import {
  ApiPropertyEmail,
  ApiPropertyOptionalEmail,
} from "src/shared/decorators/email.decorator";
import {
  ApiPropertyBoolean,
  ApiPropertyInt,
  ApiPropertyOptionalInt,
  ApiPropertyOptionalString,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";
import { ApiProperty } from "@nestjs/swagger";
import {
  ApiPropertyId,
  ApiPropertyOptionalId,
} from "src/shared/decorators/uuid.decorator";
import { TelegramFlowKeyEnum } from "src/telegram/enums/telegram-flow-key.enum";

@Entity("users")
export class UserEntity extends AbstractEntity {
  @ApiPropertyOptionalEmail()
  @Column({ nullable: true })
  @IsEmail({}, { message: "Incorrect email" })
  email?: string;

  @ApiPropertyBoolean()
  @Column({ type: "boolean", default: false })
  email_verified: boolean;

  @ApiPropertyOptionalString()
  @Column({ type: "text", unique: true, nullable: true })
  auth0Id?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  phone?: string;

  @ManyToMany(() => UserEntity, (user) => user.clients)
  @JoinTable()
  clients: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.coaches)
  @JoinTable()
  coaches: UserEntity;

  @ApiPropertyOptionalId()
  @Column({ type: "uuid", nullable: true })
  profileId?: string;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", unique: true, nullable: true })
  telegramId?: number;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  telegramUsername?: string;

  @ApiProperty({
    enum: TelegramFlowKeyEnum,
    enumName: "TelegramFlowKeyEnum",
    type: () => TelegramFlowKeyEnum,
  })
  @Column({
    type: "enum",
    enum: TelegramFlowKeyEnum,
    default: TelegramFlowKeyEnum.START,
  })
  telegramState: TelegramFlowKeyEnum;

  @OneToOne(() => UserProfileEntity, (entity) => entity.userId, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "profileId" })
  profile: UserProfileEntity;

  @OneToMany(() => UserWeightEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  weight: UserWeightEntity[];

  @OneToMany(() => UserHeightEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  height: UserHeightEntity[];

  @OneToMany(() => AnalysisEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  analysis: AnalysisEntity[];

  @OneToMany(() => NotificationEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  notifications: NotificationEntity[];

  @OneToMany(() => UserQuestionnaireAnswerEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  answers: UserQuestionnaireAnswerEntity[];

  @OneToMany(() => DiaryEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  diaries: DiaryEntity[];

  @OneToMany(() => UserHrzoneEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  hrzones: UserHrzoneEntity[];

  @OneToMany(() => TrainingPlanEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  training_plans: TrainingPlanEntity[];

  @OneToMany(() => TrainingPlanEntity, (entity) => entity.creator, {
    cascade: true,
    onDelete: "CASCADE",
  })
  creator_training_plans: TrainingPlanEntity[];

  @OneToOne(() => UserCoachProfileEntity, (entity) => entity.userId, {
    cascade: true,
    onDelete: "CASCADE",
  })
  coach_profile: UserCoachProfileEntity;

  @OneToMany(() => UserHealthProblemEntity, (entity) => entity.creator, {
    cascade: true,
    onDelete: "CASCADE",
  })
  creatorAnalysis: UserHealthProblemEntity[];
}

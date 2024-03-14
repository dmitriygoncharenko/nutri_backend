import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { IsEmail } from "class-validator";
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import {
  ApiPropertyEmail,
  ApiPropertyOptionalEmail,
} from "src/shared/decorators/email.decorator";
import {
  ApiPropertyBoolean,
  ApiPropertyOptionalInt,
  ApiPropertyOptionalString,
} from "src/shared/decorators/api.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyOptionalId } from "src/shared/decorators/uuid.decorator";
import { TelegramFlowStateEnum } from "src/telegram/enums/telegram-flow-state.enum";
import { TelegramFlowEnum } from "src/telegram/enums/telegram-flow.enum";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { MealEntity } from "src/meal/entities/meal.entity";
import { MealWeekEntity } from "src/meal/entities/meal-week.entity";
import { BotMessageEntity } from "src/telegram/entities/bot-message.entity";

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

  @ApiPropertyOptionalId()
  @Column({ type: "uuid", nullable: true })
  profileId?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", unique: true, nullable: true })
  telegramId?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  telegramUsername?: string;

  @ApiProperty({
    enum: TelegramFlowStateEnum,
    enumName: "TelegramFlowStateEnum",
    type: () => TelegramFlowStateEnum,
  })
  @Column({
    type: "enum",
    enum: TelegramFlowStateEnum,
    default: TelegramFlowStateEnum.DEFAULT,
  })
  telegramState: TelegramFlowStateEnum;

  @ApiProperty({
    enum: TelegramFlowEnum,
    enumName: "TelegramFlowEnum",
    type: () => TelegramFlowEnum,
  })
  @Column({
    type: "enum",
    enum: TelegramFlowEnum,
    default: null,
    nullable: true,
  })
  telegramFlow: TelegramFlowEnum;

  @OneToOne(() => UserProfileEntity, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "profileId" })
  profile: Partial<UserProfileEntity>;

  @OneToMany(() => MealWeekEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  mealWeeks: MealWeekEntity[];

  @OneToMany(() => SubscriptionEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => BotMessageEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  botMessages: BotMessageEntity[];

  @OneToMany(() => MealEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  meals: MealEntity[];
}

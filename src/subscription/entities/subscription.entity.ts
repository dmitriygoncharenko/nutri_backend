import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { SubscriptionTypeEnum } from "../enums/subscription-type.enum";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import {
  ApiPropertyInt,
  ApiPropertyOptionalString,
} from "src/shared/decorators/api.decorator";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { MealWeekEntity } from "src/meal/entities/meal-week.entity";

@Entity("subscriptions")
export class SubscriptionEntity extends AbstractEntity {
  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ApiProperty({
    enum: SubscriptionTypeEnum,
    enumName: "SubscriptionTypeEnum",
    example: SubscriptionTypeEnum.PAID,
    type: () => SubscriptionTypeEnum,
  })
  @Column({
    type: "enum",
    enum: SubscriptionTypeEnum,
    enumName: "SubscriptionTypeEnum",
    default: SubscriptionTypeEnum.PAID,
  })
  type: SubscriptionTypeEnum;

  @ApiProperty({
    type: () => SubscriptionStatusEnum,
    enum: SubscriptionStatusEnum,
    enumName: "SubscriptionStatusEnum",
    example: SubscriptionStatusEnum.CREATED,
  })
  @Column({
    type: "enum",
    enum: SubscriptionStatusEnum,
    enumName: "SubscriptionStatusEnum",
    default: SubscriptionStatusEnum.CREATED,
  })
  status: SubscriptionStatusEnum;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  failMessage?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  paymentId?: string;

  @ApiPropertyInt()
  @Column({ type: "int" })
  generations: number;

  @ApiProperty({ type: () => MealWeekEntity, isArray: true })
  @OneToMany(() => MealWeekEntity, (entity) => entity.subscription, {
    cascade: true,
    onDelete: "CASCADE",
  })
  mealWeeks: MealWeekEntity[];
}

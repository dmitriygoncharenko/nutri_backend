import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { SubscriptionTypeEnum } from "../enums/subscription-type.enum";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyDate } from "src/shared/decorators/date.decorator";
import {
  ApiPropertyInt,
  ApiPropertyOptionalString,
} from "src/shared/decorators/api.decorator";
import { MealGroupEntity } from "src/meal/entities/meal-group.entity";
import { isArray } from "class-validator";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";

@Entity("subscriptions")
export class SubscriptionEntity extends AbstractEntity {
  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.height)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ApiProperty({
    enum: SubscriptionTypeEnum,
    enumName: "SubscriptionTypeEnum",
    example: SubscriptionTypeEnum.MENU,
    type: () => SubscriptionTypeEnum,
  })
  @Column({
    type: "enum",
    enum: SubscriptionTypeEnum,
    enumName: "SubscriptionTypeEnum",
    default: SubscriptionTypeEnum.MENU,
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
  provider_payment_charge_id: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  telegram_payment_charge_id: string;

  @ApiPropertyInt()
  @Column({ type: "int" })
  generations: number;

  @ApiProperty({ type: () => MealGroupEntity, isArray: true })
  @OneToMany(() => MealGroupEntity, (entity) => entity.subscription, {
    cascade: true,
    onDelete: "CASCADE",
  })
  mealGroups: MealGroupEntity[];
}

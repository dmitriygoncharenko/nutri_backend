import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MealEntity } from "./meal.entity";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { ApiPropertyDate } from "src/shared/decorators/date.decorator";
import {
  ApiPropertyOptionalString,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";
import { MealGroupStatusEnum } from "../enums/meal-group-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";

@Entity("meal_groups")
export class MealGroupEntity extends AbstractEntity {
  @ApiPropertyDate()
  @Column({ type: "timestamptz" })
  start: Date;

  @ApiPropertyDate()
  @Column({ type: "timestamptz" })
  end: Date;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  threadId?: string;

  @ApiProperty({
    type: () => MealGroupStatusEnum,
    enum: MealGroupStatusEnum,
    enumName: "MealGroupStatusEnum",
    example: MealGroupStatusEnum.CREATED,
  })
  @Column({
    type: "enum",
    enum: MealGroupStatusEnum,
    enumName: "MealGroupStatusEnum",
    default: MealGroupStatusEnum.CREATED,
  })
  status: MealGroupStatusEnum;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  failMessage?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  ingredients?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  ingredientsRunId?: string;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  subscriptionId: string;

  @ManyToOne(() => SubscriptionEntity, (entity) => entity.mealGroups)
  @JoinColumn({ name: "subscriptionId" })
  subscription: SubscriptionEntity;

  @ApiProperty({ type: () => MealEntity, isArray: true })
  @OneToMany(() => MealEntity, (entity) => entity.mealGroup, {
    cascade: true,
    onDelete: "CASCADE",
  })
  meals: MealEntity[];
}

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
import { MealDayStatusEnum } from "../enums/meal-day-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { MealWeekEntity } from "./meal-week.entity";

@Entity("meal_days")
export class MealDayEntity extends AbstractEntity {
  @ApiPropertyDate()
  @Column({ type: "timestamptz" })
  date: Date;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  threadId?: string;

  @ApiProperty({
    type: () => MealDayStatusEnum,
    enum: MealDayStatusEnum,
    enumName: "MealDayStatusEnum",
    example: MealDayStatusEnum.CREATED,
  })
  @Column({
    type: "enum",
    enum: MealDayStatusEnum,
    enumName: "MealDayStatusEnum",
    default: MealDayStatusEnum.CREATED,
  })
  status: MealDayStatusEnum;

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
  mealWeekId: string;

  @ManyToOne(() => MealWeekEntity, (entity) => entity.mealDays)
  @JoinColumn({ name: "mealWeekId" })
  mealWeek: MealWeekEntity;

  @ApiProperty({ type: () => MealEntity, isArray: true })
  @OneToMany(() => MealEntity, (entity) => entity.mealDay, {
    cascade: true,
    onDelete: "CASCADE",
  })
  meals: MealEntity[];
}

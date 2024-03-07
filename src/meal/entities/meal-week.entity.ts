import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { MealWeekStatusEnum } from "../enums/meal-week-status.enum";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { MealDayEntity } from "./meal-day.entity";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ApiPropertyDate } from "src/shared/decorators/date.decorator";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";

export interface IngredientInterface {
  name: string;
  quantity: number;
  metric: string;
}

@Entity("meal_weeks")
export class MealWeekEntity extends AbstractEntity {
  @ApiPropertyDate()
  @Column({ type: "timestamptz" })
  start: Date;

  @ApiPropertyDate()
  @Column({ type: "timestamptz" })
  end: Date;

  @ApiProperty({
    type: () => MealWeekStatusEnum,
    enum: MealWeekStatusEnum,
    enumName: "MealWeekStatusEnum",
    example: MealWeekStatusEnum.CREATED,
  })
  @Column({
    type: "enum",
    enum: MealWeekStatusEnum,
    enumName: "MealWeekStatusEnum",
    default: MealWeekStatusEnum.CREATED,
  })
  status?: MealWeekStatusEnum;

  @ApiPropertyOptional({ type: "jsonb", default: [] })
  @Column({ type: "jsonb", default: [] })
  ingredients?: IngredientInterface[];

  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.mealWeeks)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  subscriptionId: string;

  @ApiProperty({ type: () => SubscriptionEntity })
  @ManyToOne(() => SubscriptionEntity, (entity) => entity.mealWeeks)
  @JoinColumn({ name: "subscriptionId" })
  subscription: SubscriptionEntity;

  @ApiProperty({ type: () => MealDayEntity, isArray: true })
  @OneToMany(() => MealDayEntity, (entity) => entity.mealWeek, {
    cascade: true,
    onDelete: "CASCADE",
  })
  mealDays: MealDayEntity[];
}

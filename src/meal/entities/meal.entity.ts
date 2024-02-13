import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MealTypeEnum } from "../enums/meal-type.enum";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import {
  ApiPropertyInt,
  ApiPropertyOptionalInt,
  ApiPropertyOptionalString,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";
import { SubscriptionEntity } from "src/subscription/entities/subscription.entity";
import { MealStatusEnum } from "../enums/meal-status.enum";
import { ApiPropertyOptionalDate } from "src/shared/decorators/date.decorator";

interface IngredientInterface {
  name: string;
  quantity: number;
  metric: string;
}

@Entity("meals")
export class MealEntity extends AbstractEntity {
  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({
    type: () => MealStatusEnum,
    enum: MealStatusEnum,
    enumName: "MealStatusEnum",
    example: MealStatusEnum.CREATED,
  })
  @Column({
    type: "enum",
    enum: MealStatusEnum,
    enumName: "MealStatusEnum",
    default: MealStatusEnum.CREATED,
  })
  status: MealStatusEnum;

  @ApiProperty({
    type: () => MealTypeEnum,
    enum: MealTypeEnum,
    enumName: "MealTypeEnum",
    example: MealTypeEnum.BREAKFAST,
  })
  @Column({ type: "enum", enum: MealTypeEnum, enumName: "MealTypeEnum" })
  type: MealTypeEnum;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  query?: string;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable: true })
  cookTime?: number;

  @ApiPropertyString({ isArray: true })
  @Column({ type: "jsonb", default: [] })
  steps: string[];

  @ApiPropertyString({ isArray: true })
  @Column({ type: "jsonb", default: [] })
  elements: string[];

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable: true })
  fats?: number;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable: true })
  carbo?: number;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable: true })
  protein?: number;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable: true })
  calories?: number;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  title?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  description?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  intro?: string;

  @ApiProperty({ isArray: true })
  @Column({ type: "jsonb", default: [] })
  ingredients: IngredientInterface[];

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  image?: string;

  @ApiPropertyOptionalDate()
  @Column({ type: "timestamptz", nullable: true })
  date?: Date;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  subscriptionId: string;

  @ApiProperty({
    type: () => SubscriptionEntity,
  })
  @ManyToOne(() => SubscriptionEntity, (entity) => entity.meals)
  @JoinColumn({ name: "subscriptionId" })
  subscription: SubscriptionEntity;
}

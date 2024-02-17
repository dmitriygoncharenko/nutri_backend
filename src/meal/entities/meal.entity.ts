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
import { MealGroupEntity } from "./meal-group.entity";
import { UserEntity } from "src/user/entities/user.entity";

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
  response?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  image?: string;

  @ApiPropertyOptionalDate()
  @Column({ type: "timestamptz", nullable: true })
  date?: Date;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  mealGroupId: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  messageId?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  runId?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable: true })
  url?: string;

  @ApiProperty({
    type: () => MealGroupEntity,
  })
  @ManyToOne(() => MealGroupEntity, (entity) => entity.meals)
  @JoinColumn({ name: "mealGroupId" })
  mealGroup: MealGroupEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.meals)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

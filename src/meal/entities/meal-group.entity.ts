import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MealTypeEnum } from "../enums/meal-type.enum";
import { SubscriptionEntity } from "src/billing/entities/subscription.entity";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { ApiPropertyInt } from "src/shared/decorators/api.decorator";

@Entity("meal_groups")
export class MealGroupEntity extends AbstractEntity {
  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({
    type: () => MealTypeEnum,
    isArray: true,
    enum: MealTypeEnum,
    enumName: "meal_group_meal_type_enum",
    example: MealTypeEnum.BREAKFAST,
  })
  @Column({
    type: "enum",
    enum: MealTypeEnum,
    enumName: "meal_group_meal_type_enum",
    array: true,
  })
  types: MealTypeEnum[];

  @ApiPropertyInt()
  @Column({ type: "int" })
  days: number;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  subscriptionId: string;

  @ApiProperty({
    type: () => SubscriptionEntity,
  })
  @ManyToOne(() => SubscriptionEntity, (entity) => entity.mealGroups)
  @JoinColumn({ name: "subscriptionId" })
  subscription: SubscriptionEntity;
}

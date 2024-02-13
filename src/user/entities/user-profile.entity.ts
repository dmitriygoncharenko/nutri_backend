import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserGenderEnum } from "src/user/enums/user-gender.enum";
import { BeforeInsert, Column, Entity } from "typeorm";
import { UserFamilyRelationEnum } from "../enums/user-family-relation.enum";
import {
  ApiPropertyOptionalInt,
  ApiPropertyOptionalString,
} from "src/shared/decorators/api.decorator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BadRequestException } from "@nestjs/common";
import { DietEnum } from "../enums/diet.enum";
import { UserActivityLevelEnum } from "../enums/user-activity-level.enum";
import { UserGoalEnum } from "../enums/user-goal.enum";
import { PaymentMethodEnum } from "src/subscription/enums/payment-method.enum";
import { MealTypeEnum } from "src/meal/enums/meal-type.enum";
import { UserRegionEnum } from "../enums/user-region.enum";

const nullable: boolean = true;

@Entity("user_profiles")
export class UserProfileEntity extends AbstractEntity {
  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  fullname?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  telegramName?: string;

  @ApiPropertyOptionalString()
  @Column({ nullable })
  avatar?: string;

  @ApiProperty({
    enum: UserGenderEnum,
    enumName: "UserGenderEnum",
    example: UserGenderEnum.MALE,
    type: () => UserGenderEnum,
  })
  @Column({ type: "enum", enum: UserGenderEnum, default: UserGenderEnum.MALE })
  gender: UserGenderEnum;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  dob?: string;

  @BeforeInsert()
  checkDobFormat() {
    if (this?.dob && !/^\d{2}\.\d{2}\.\d{4}$/.test(this?.dob))
      throw new BadRequestException({ message: "Wrong dob format" });
  }

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable })
  weight?: number;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable })
  height?: number;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable })
  metabolism?: number;

  @ApiProperty({
    enum: UserGoalEnum,
    enumName: "UserGoalEnum",
    example: [UserGoalEnum.WEIGHT_LOSS],
    isArray: true,
    type: () => UserGoalEnum,
  })
  @Column({ type: "enum", array: true, enum: UserGoalEnum, default: [] })
  goal?: UserGoalEnum[];

  @ApiPropertyOptional({
    type: () => UserRegionEnum,
    enum: UserRegionEnum,
    enumName: "UserRegionEnum",
    example: UserRegionEnum.EastAndSoutheastAsia,
  })
  @Column({
    type: "enum",
    enum: UserRegionEnum,
    enumName: "UserRegionEnum",
    nullable: true,
  })
  location?: UserRegionEnum;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  food_habits?: string;

  @ApiPropertyOptional({
    enum: UserActivityLevelEnum,
    enumName: "UserActivityLevelEnum",
    example: UserActivityLevelEnum.EXTRA_ACTIVE,
    nullable: true,
    type: () => UserActivityLevelEnum,
  })
  @Column({ type: "enum", enum: UserActivityLevelEnum, nullable })
  activity_level?: UserActivityLevelEnum;

  @ApiProperty({
    enum: MealTypeEnum,
    enumName: "ProfileMealTypeEnum",
    example: [MealTypeEnum.BREAKFAST],
    isArray: true,
    type: () => MealTypeEnum,
  })
  @Column({
    type: "enum",
    array: true,
    enum: MealTypeEnum,
    enumName: "ProfileMealTypeEnum",
    default: [],
  })
  mealTypes?: MealTypeEnum[];

  @ApiProperty({
    enum: DietEnum,
    enumName: "DietEnum",
    example: DietEnum.KETO,
    nullable: true,
    type: () => DietEnum,
  })
  @Column({ type: "enum", enum: DietEnum, nullable })
  diet?: DietEnum;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  city?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  environment?: string;

  @ApiProperty({
    enum: UserFamilyRelationEnum,
    enumName: "UserFamilyRelationEnum",
    example: UserFamilyRelationEnum.MARRIED,
    nullable: true,
    type: () => UserFamilyRelationEnum,
  })
  @Column({ type: "enum", enum: UserFamilyRelationEnum, nullable })
  family_relation?: UserFamilyRelationEnum;

  @ApiPropertyOptionalInt()
  @Column({ type: "int", nullable })
  children_count?: number;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  occupation?: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  initial_request: string;

  @ApiPropertyOptionalString()
  @Column({ type: "text", nullable })
  initial_complaints: string;

  @ApiProperty({
    type: () => PaymentMethodEnum,
    enum: PaymentMethodEnum,
    enumName: "PaymentMethodEnum",
    example: PaymentMethodEnum.INTERNATIONAL_CARD,
  })
  @Column({
    type: "enum",
    enum: PaymentMethodEnum,
    enumName: "PaymentMethodEnum",
    default: PaymentMethodEnum.RUSSIAN_CARD,
  })
  payment_method: PaymentMethodEnum;
}

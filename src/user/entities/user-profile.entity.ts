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
import { UserFoodCountEnum } from "../enums/user-food-count.enum";
import { UserFoodTypeEnum } from "../enums/user-food-type.enum";
import { UserActivityLevelEnum } from "../enums/user-activity-level.enum";
import { UserGoalEnum } from "../enums/user-goal.enum";
import { PaymentMethodEnum } from "src/billing/enums/payment-method.enum";

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
  basal_metabolism?: number;

  @ApiProperty({
    enum: UserGoalEnum,
    enumName: "UserGoalEnum",
    example: [UserGoalEnum.WEIGHT_LOSS],
    isArray: true,
    type: () => UserGoalEnum,
  })
  @Column({ type: "enum", array: true, enum: UserGoalEnum, default: [] })
  goal?: UserGoalEnum[];

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
    enum: UserFoodCountEnum,
    enumName: "UserFoodCountEnum",
    example: [UserFoodCountEnum.BREAKFAST],
    isArray: true,
    type: () => UserFoodCountEnum,
  })
  @Column({ type: "enum", array: true, enum: UserFoodCountEnum, default: [] })
  food_count?: UserFoodCountEnum[];

  @ApiProperty({
    enum: UserFoodTypeEnum,
    enumName: "UserFoodTypeEnum",
    example: UserFoodTypeEnum.KETO,
    nullable: true,
    type: () => UserFoodTypeEnum,
  })
  @Column({ type: "enum", enum: UserFoodTypeEnum, nullable })
  food_type?: UserFoodTypeEnum;

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

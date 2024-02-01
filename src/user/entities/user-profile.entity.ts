import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserGenderEnum } from "src/user/enums/user-gender.enum";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserFamilyRelationEnum } from "../enums/user-family-relation.enum";
import { UserEntity } from "./user.entity";
import {
  ApiPropertyEnum,
  ApiPropertyOptionalInt,
  ApiPropertyOptionalString,
} from "src/shared/decorators/api.decorator";
import { ApiPropertyOptionalDate } from "src/shared/decorators/date.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";

const nullable: boolean = true;

@Entity("user_profiles")
export class UserProfileEntity extends AbstractEntity {
  @ApiPropertyOptionalString()
  @Column({ nullable })
  fullname?: string;

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

  @ApiPropertyOptionalDate()
  @Column({ type: "timestamptz", nullable })
  dob?: Date;

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

  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;
}

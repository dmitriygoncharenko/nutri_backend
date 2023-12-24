import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserGenderEnum } from "src/user/enums/user-gender.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { UserFamilyStatusEnum } from "../enums/user-family-status.enum";

const nullable: boolean = true;

@Entity("user_profiles")
export class UserProfileEntity extends AbstractEntity {
  @Column({ nullable })
  first_name?: string;

  @Column({ nullable })
  last_name?: string;

  @Column({ nullable })
  avatar?: string;

  @Column({ type: "enum", enum: UserGenderEnum, default: UserGenderEnum.MALE })
  gender: UserGenderEnum;

  @Column({ type: "timestamp", nullable })
  dob?: Date;

  @Column({ type: "text", nullable })
  city?: string;

  @Column({ type: "text", nullable })
  environment?: string;

  @Column({ type: "enum", enum: UserFamilyStatusEnum, nullable })
  family_status?: UserFamilyStatusEnum;

  @Column({ type: "int", nullable })
  children_count?: number;

  @Column({ type: "text", nullable })
  profession?: string;

  @Column({ type: "text", nullable })
  initial_request: string;

  @Column({ type: "text", nullable })
  initial_complaints: string;
}

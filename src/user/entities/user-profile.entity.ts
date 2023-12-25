import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserGenderEnum } from "src/user/enums/user-gender.enum";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserFamilyRelationEnum } from "../enums/user-family-relation.enum";
import { UserEntity } from "./user.entity";

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

  @Column({ type: "timestamptz", nullable })
  dob?: Date;

  @Column({ type: "text", nullable })
  city?: string;

  @Column({ type: "text", nullable })
  environment?: string;

  @Column({ type: "enum", enum: UserFamilyRelationEnum, nullable })
  family_relation?: UserFamilyRelationEnum;

  @Column({ type: "int", nullable })
  children_count?: number;

  @Column({ type: "text", nullable })
  occupation?: string;

  @Column({ type: "text", nullable })
  initial_request: string;

  @Column({ type: "text", nullable })
  initial_complaints: string;

  @Column({ type: "uuid" })
  userId: string;

  @OneToOne(() => UserEntity, (entity) => entity.profile, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;
}

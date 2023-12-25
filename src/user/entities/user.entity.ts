import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { UserWeightEntity } from "./user-weight.entity";
import { AnalysisEntity } from "src/analysis/entities/analysis.entity";
import { UserHeightEntity } from "./user-height.entity";
import { NotificationEntity } from "src/notification/entities/notification.entity";
import { UserAnswerEntity } from "./user-answer.entity";
import { DiaryEntity } from "src/diary/entities/diary.entity";
import { UserHrzoneEntity } from "./user-hrzone.entity";

@Entity("users")
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false })
  @IsEmail({}, { message: "Incorrect email" })
  @IsNotEmpty({ message: "The email is required" })
  email: string;

  @Column({ type: "text" })
  @IsPhoneNumber(null, { message: "Incorrect phone number" })
  phone: string;

  @ManyToMany((type) => UserEntity, (user) => user.clients)
  @JoinTable()
  clients: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.coaches)
  @JoinTable()
  coaches: UserEntity;

  @Column({ type: "uuid" })
  profileId: string;

  @OneToOne(() => UserProfileEntity, (entity) => entity.user, {
    nullable: true,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "profileId", referencedColumnName: "id" })
  profile: UserProfileEntity;

  @OneToMany(() => UserWeightEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  weight: UserWeightEntity[];

  @OneToMany(() => UserHeightEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  height: UserHeightEntity[];

  @OneToMany(() => AnalysisEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  analysis: AnalysisEntity[];

  @OneToMany(() => NotificationEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  notifications: NotificationEntity[];

  @OneToMany(() => UserAnswerEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  answers: UserAnswerEntity[];

  @OneToMany(() => DiaryEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  diaries: DiaryEntity[];

  @OneToMany(() => UserHrzoneEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  hrzones: UserHrzoneEntity[];
}

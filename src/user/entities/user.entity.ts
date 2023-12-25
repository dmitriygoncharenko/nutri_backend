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
import { UserAnamnesisEntity } from "./user-anamnesis.entity";
import { AnalysisEntity } from "src/analysis/entities/analysis.entity";
import { UserHeightEntity } from "./user-height.entity";
import { NotificationEntity } from "src/notification/entities/notification.entity";

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

  @OneToMany(() => UserAnamnesisEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  anamnesis: UserAnamnesisEntity[];

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
}

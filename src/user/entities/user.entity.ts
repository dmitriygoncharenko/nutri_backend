import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { IsEmail, IsNotEmpty, IsPhoneNumber, Length } from "class-validator";
import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { UserProfileEntity } from "./user-profile.entity";
import { UserAnthropometryEntity } from "./user-anthropometry.entity";

@Entity("users")
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false })
  @IsEmail({}, { message: "Incorrect email" })
  @IsNotEmpty({ message: "The email is required" })
  email: string;

  @Column({ type: "text" })
  @IsPhoneNumber(null, { message: "Incorrect phone number" })
  phone: string;

  @OneToMany((type) => UserEntity, (user) => user.coach)
  clients: UserEntity[];

  @Column({ type: "uuid", nullable: true })
  coachId: string;

  @ManyToOne(() => UserEntity, (user) => user.clients)
  @JoinColumn({ name: "coachId", referencedColumnName: "id" })
  coach: UserEntity;

  @OneToOne(() => UserProfileEntity)
  @JoinColumn()
  profile: UserProfileEntity;

  @OneToMany(() => UserAnthropometryEntity, (entity) => entity.user, {
    cascade: true,
    onDelete: "CASCADE",
  })
  user_anthropometry: UserAnthropometryEntity[];
}

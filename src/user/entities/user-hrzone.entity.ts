import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("user_hrzones")
export class UserHrzoneEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.hrzones)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column({ type: "text" })
  zone1: string;

  @Column({ type: "text" })
  zone2: string;

  @Column({ type: "text" })
  zone3: string;

  @Column({ type: "text" })
  zone4: string;

  @Column({ type: "text" })
  zone5: string;
}

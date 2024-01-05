import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

const nullable: boolean = true;

@Entity("notifications")
export class NotificationEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @Column({ type: "text", nullable })
  description?: string;

  @ManyToOne(() => UserEntity, (entity) => entity.notifications)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

const nullable: boolean = true;
@Entity("diaries")
export class DiaryEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.diaries)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;

  @Column({ type: "timestamptz" })
  date: Date;

  @Column({ type: "text", nullable })
  sleep?: string;

  @Column({ type: "text", nullable })
  energy?: string;

  @Column({ type: "text", nullable })
  emotion?: string;

  @Column({ type: "text", nullable })
  physical?: string;

  @Column({ type: "text", nullable })
  comment?: string;
}

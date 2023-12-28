import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TrainingTypeEntity } from "./training-type.entity";
import { UserEntity } from "src/user/entities/user.entity";

@Entity("training_plans")
export class TrainingPlanEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.training_plans)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;

  @Column({ type: "uuid" })
  creatorId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.creator_training_plans)
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  creator: UserEntity;

  @Column({ type: "uuid" })
  typeId: string;
  type: TrainingTypeEntity;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "timetz", nullable: true })
  time?: string;
}

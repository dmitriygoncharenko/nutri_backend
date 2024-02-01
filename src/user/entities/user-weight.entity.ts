import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { WeightMetricEnum } from "src/shared/enums/weight-metric.enum";
import { HeightMetricEnum } from "src/shared/enums/height-metric.enum";

@Entity("user_weights")
export class UserWeightEntity extends AbstractEntity {
  @Column({ type: "decimal", precision: 5, scale: 2 })
  weight: number;

  @Column({
    type: "enum",
    enum: WeightMetricEnum,
    default: WeightMetricEnum.KILOGRAM,
  })
  weight_metric: WeightMetricEnum;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.weight)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { WeightMetricEnum } from "src/shared/enums/weight-metric.enum";
import { HeightMetricEnum } from "src/shared/enums/height-metric.enum";

@Entity("user_height")
export class UserHeightEntity extends AbstractEntity {
  @Column({ type: "int" })
  height: number;

  @Column({
    type: "enum",
    enum: HeightMetricEnum,
    default: HeightMetricEnum.CENTIMETER,
  })
  height_metric: HeightMetricEnum;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.height)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;
}

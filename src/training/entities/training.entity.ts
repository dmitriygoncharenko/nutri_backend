import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { TrainingTypeEntity } from "./training-type.entity";
import { DecimalTransformer } from "src/shared/transformers/decimal.transformer";

@Entity("trainings")
export class TrainingEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  typeId: string;

  @ManyToOne(() => TrainingTypeEntity, (entity) => entity.trainings)
  @JoinColumn({ name: "typeId", referencedColumnName: "id" })
  type: TrainingTypeEntity;

  @Column({
    type: "decimal",
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  distance: number;

  @Column({ type: "int" }) // seconds
  duration: number;

  hr;
  calories;
}

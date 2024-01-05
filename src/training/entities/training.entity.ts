import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { TrainingTypeEntity } from "./training-type.entity";
import { DecimalTransformer } from "src/shared/transformers/decimal.transformer";

@Entity("trainings")
export class TrainingEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  typeId: string;

  @ManyToOne(() => TrainingTypeEntity, (entity) => entity.trainings)
  @JoinColumn({ name: "typeId" })
  type: TrainingTypeEntity;

  @Column({ type: "int" }) // meters
  distance: number;

  @Column({ type: "int" }) // seconds
  duration: number;

  @Column({ type: "int" }) // example 156
  hr: number;

  @Column({ type: "int" })
  calories: number;
}

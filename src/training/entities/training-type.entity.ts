import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { TrainingEntity } from "./training.entity";

@Entity("training_types")
export class TrainingTypeEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @OneToMany(() => TrainingEntity, (entity) => entity.type, {
    cascade: true,
    onDelete: "SET NULL",
  })
  trainings: TrainingEntity[];
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DiaryEntity } from "./diary.entity";

@Entity("diary_foods")
export class DiaryFoodEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  diaryId: string;

  @ManyToOne(() => DiaryEntity, (entity) => entity.foods)
  @JoinColumn({ name: "diaryId" })
  diary: DiaryEntity;

  @Column({ type: "timetz" })
  time: string;

  food: string;
  value: number;
  metric: string;

  @Column({ type: "boolean", default: false })
  eaten: boolean;
}

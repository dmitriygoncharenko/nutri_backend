import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DiaryEntity } from "./diary.entity";

@Entity("diary_waters")
export class DiaryWaterEntity extends AbstractEntity {
  @Column({ type: "int" })
  value: number; // milliliters

  @Column({ type: "uuid" })
  diaryId: string;

  @ManyToOne(() => DiaryEntity, (entity) => entity.waters)
  @JoinColumn({ name: "diaryId" })
  diary: DiaryEntity;

  @Column({ type: "timetz" })
  time: string;
}

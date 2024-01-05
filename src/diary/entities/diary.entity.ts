import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { DiaryWaterEntity } from "./diary-water.entity";
import { DiaryFoodEntity } from "./diary-food.entity";

const nullable: boolean = true;
@Entity("diaries")
export class DiaryEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.diaries)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @Column({ type: "date" })
  date: string;

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

  @OneToMany(() => DiaryWaterEntity, (entity) => entity.diary, {
    cascade: true,
    onDelete: "CASCADE",
  })
  waters: DiaryWaterEntity[];

  @OneToMany(() => DiaryFoodEntity, (entity) => entity.diary, {
    cascade: true,
    onDelete: "CASCADE",
  })
  foods: DiaryFoodEntity[];
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AnalysisValueEntity } from "./analysis-value.entity";

@Entity("analysis")
export class AnalysisEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.analysis)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @OneToMany(() => AnalysisValueEntity, (entity) => entity.analysis, {
    cascade: true,
    onDelete: "CASCADE",
  })
  values: AnalysisValueEntity[];
}

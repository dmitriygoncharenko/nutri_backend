import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { UserAnamnesisEntity } from "./user-anamnesis.entity";

@Entity("user_anamnesis_types")
export class UserAnamnesisTypeEntity extends AbstractEntity {
  @Column({ type: "text" })
  caption: string;

  @OneToMany(() => UserAnamnesisEntity, (entity) => entity.anamnesisType, {
    cascade: true,
    onDelete: "CASCADE",
  })
  anamnesis: UserAnamnesisEntity[];
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { UserAnamnesisTypeEntity } from "./user-anamnesis-type.entity";

@Entity("user_anamnesis")
export class UserAnamnesisEntity extends AbstractEntity {
  @Column({ type: "uuid" })
  anamnesisTypeId: string;

  @Column({ type: "text" })
  anamnesis: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.anamnesis)
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: UserEntity;

  @ManyToOne(() => UserAnamnesisTypeEntity, (user) => user.anamnesis)
  @JoinColumn({ name: "anamnesisTypeId", referencedColumnName: "id" })
  anamnesisType: UserAnamnesisTypeEntity;
}

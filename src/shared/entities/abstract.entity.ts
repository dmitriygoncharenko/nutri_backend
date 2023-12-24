import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: string;

  @DeleteDateColumn({ type: "timestamp with time zone" })
  deletedAt: Date;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}

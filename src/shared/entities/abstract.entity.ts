import {
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiPropertyOptionalId } from "../decorators/uuid.decorator";
import { ApiPropertyOptionalDate } from "../decorators/date.decorator";
import { v4 as uuidv4 } from "uuid";

export abstract class AbstractEntity {
  @ApiPropertyOptionalId()
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @BeforeInsert() genarateId() {
    this.id = uuidv4();
  }

  @ApiPropertyOptionalDate({ type: Date })
  @DeleteDateColumn({ type: "timestamptz" })
  deletedAt: Date;

  @ApiPropertyOptionalDate({ type: Date })
  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ApiPropertyOptionalDate({ type: Date })
  @UpdateDateColumn({
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}

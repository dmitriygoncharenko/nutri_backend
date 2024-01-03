import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiPropertyOptionalId } from "../decorators/uuid.decorator";
import { ApiPropertyOptionalDate } from "../decorators/date.decorator";

export abstract class AbstractEntity {
  @ApiPropertyOptionalId()
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  id!: string;

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

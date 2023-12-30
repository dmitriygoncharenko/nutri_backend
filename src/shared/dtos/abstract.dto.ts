import { AbstractEntity } from "../entities/abstract.entity";
import { ApiPropertyDate } from "../decorators/date.decorator";
import { ApiPropertyId } from "../decorators/uuid.decorator";

export class AbstractDto {
  @ApiPropertyId()
  readonly id: string;
  @ApiPropertyDate()
  readonly createdAt: Date;
  @ApiPropertyDate()
  readonly updatedAt: Date;
  @ApiPropertyDate()
  readonly deletedAt: Date;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}

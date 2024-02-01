import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";

export class UserClientQueryDto {
  @ApiPropertyId()
  userId: string;
}

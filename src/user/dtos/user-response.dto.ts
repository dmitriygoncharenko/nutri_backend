import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyEmail } from "src/shared/decorators/email.decorator";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { AbstractDto } from "src/shared/dtos/abstract.dto";

export class UserResponseDto extends AbstractDto {
  @ApiPropertyEmail()
  readonly email: string;

  @ApiProperty({ type: "string" })
  phone: string;

  @ApiPropertyId()
  profileId: string;
}

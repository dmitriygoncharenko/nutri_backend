import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyEmail } from "src/shared/decorators/email.decorator";
import { AbstractDto } from "src/shared/dtos/abstract.dto";

export class UserResponseDto extends AbstractDto {
  @ApiPropertyEmail()
  readonly email: string;

  @ApiProperty({ type: "string" })
  phone: string;

  @ApiProperty({ type: "uuid" })
  profileId: string;
}

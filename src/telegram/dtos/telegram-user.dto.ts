import {
  ApiPropertyInt,
  ApiPropertyOptionalBoolean,
  ApiPropertyOptionalString,
  ApiPropertyString,
} from 'src/shared/decorators/api.decorator';

export class TelegramUserDto {
  @ApiPropertyInt()
  id: number;

  @ApiPropertyOptionalBoolean()
  is_bot?: boolean;

  @ApiPropertyString()
  first_name: string;

  @ApiPropertyOptionalString()
  last_name?: string;

  @ApiPropertyOptionalString()
  username?: string;

  @ApiPropertyOptionalString()
  language_code?: string;

  @ApiPropertyOptionalBoolean()
  is_premium?: true;

  @ApiPropertyOptionalString()
  photo_url?: string;
}

import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export function ApiPropertyUsername(
  min: number,
  max: number,
  options: ApiPropertyOptions = {},
) {
  return applyDecorators(
    MinLength(min),
    MaxLength(max),
    IsString(),
    IsNotEmpty(),
    ApiProperty({
      example: 'UserName',
      minLength: min,
      maxLength: max,
      ...options,
    }),
  );
}
export function ApiPropertyOptionalUsername(
  min: number,
  max: number,
  options: ApiPropertyOptions = {},
) {
  return applyDecorators(
    MinLength(min),
    MaxLength(max),
    IsString(),
    IsOptional(),
    ApiPropertyOptional({
      example: 'UserName',
      minLength: min,
      maxLength: max,
      ...options,
    }),
  );
}

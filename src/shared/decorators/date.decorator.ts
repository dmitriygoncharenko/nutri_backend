import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export function ApiPropertyDate(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    Type(() => Date),
    IsDate(),
    ApiProperty({
      type: 'string',
      example: new Date(),
      format: 'date-time',
      ...options,
    }),
  );
}
export function ApiPropertyOptionalDate(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    Type(() => Date),
    IsDate(),
    IsOptional(),
    ApiPropertyOptional({
      type: 'string',
      example: new Date(),
      format: 'date-time',
      ...options,
    }),
  );
}

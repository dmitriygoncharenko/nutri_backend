import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { IsOptional, IsUUID, ValidationOptions } from 'class-validator';

export function ApiPropertyId(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    IsUUID('all', validationOptions),
    ApiProperty({
      type: 'string',
      format: 'uuid',
      minLength: 36,
      maxLength: 36,
      ...options,
    }),
  );
}
export function ApiPropertyOptionalId(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    IsUUID('all', validationOptions),
    IsOptional(),
    ApiPropertyOptional({
      type: 'string',
      format: 'uuid',
      minLength: 36,
      maxLength: 36,
      ...options,
    }),
  );
}

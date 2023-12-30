import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  NotEquals,
  ValidateIf,
  ValidateNested,
  ValidationOptions,
} from 'class-validator';

export function ApiPropertyName(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    IsString(),
    MinLength(2),
    IsNotEmpty(),
    ApiProperty({ ...options, minLength: 2 }),
  );
}
export function ApiPropertyOptionalName(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    IsString(),
    MinLength(2),
    IsOptional(),
    ApiPropertyOptional({ minLength: 1, ...options }),
  );
}

export function ApiPropertyEnum(
  enumValues: any[] | Record<string, any>,
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    IsEnum(enumValues, validationOptions),
    IsNotEmpty(),
    ApiProperty({ enum: enumValues, ...options }),
  );
}
export function ApiPropertyOptionalEnum(
  enumValues: any[] | Record<string, any>,
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    IsOptional(),
    IsEnum(enumValues, validationOptions),
    ApiPropertyOptional({ enum: enumValues, ...options }),
  );
}

export function ApiPropertyUrl(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    IsUrl(),
    IsNotEmpty(),
    ApiProperty({ format: 'uri', example: 'https://example.com', ...options }),
  );
}
export function ApiPropertyOptionalUrl(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    IsUrl(),
    IsOptional(),
    ApiPropertyOptional({
      format: 'uri',
      example: 'https://example.com',
      ...options,
    }),
  );
}

export function ApiPropertyBigInt(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    Matches(
      /\b(?:[0-9]{1,18}|[1-8][0-9]{18}|9(?:[01][0-9]{17}|2(?:[01][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[01][0-9]{12}|20(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|80[0-7]))))))))))))))))\b/m,
      {
        message: 'regular.expression',
      },
    ),
    IsString(validationOptions),
    IsNotEmpty(),
    ApiProperty({ type: 'string', example: '999999999', ...options }),
  );
}
export function ApiPropertyOptionalBigInt(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    Matches(
      /\b(?:[0-9]{1,18}|[1-8][0-9]{18}|9(?:[01][0-9]{17}|2(?:[01][0-9]{16}|2(?:[0-2][0-9]{15}|3(?:[0-2][0-9]{14}|3(?:[0-6][0-9]{13}|7(?:[01][0-9]{12}|20(?:[0-2][0-9]{10}|3(?:[0-5][0-9]{9}|6(?:[0-7][0-9]{8}|8(?:[0-4][0-9]{7}|5(?:[0-3][0-9]{6}|4(?:[0-6][0-9]{5}|7(?:[0-6][0-9]{4}|7(?:[0-4][0-9]{3}|5(?:[0-7][0-9]{2}|80[0-7]))))))))))))))))\b/m,
      {
        message: 'regular.expression',
      },
    ),
    IsString(validationOptions),
    IsOptional(),
    ApiPropertyOptional({ type: 'string', example: '999999999', ...options }),
  );
}

export function ApiPropertyString(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    IsString(validationOptions),
    IsNotEmpty(),
    ApiProperty({ type: 'string', ...options }),
  );
}
export function ApiPropertyOptionalString(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {},
) {
  return applyDecorators(
    IsString(validationOptions),
    IsOptional(),
    ApiPropertyOptional({ type: 'string', ...options }),
  );
}

export function ApiPropertyBoolean(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    IsBoolean(),
    ApiProperty({ type: 'boolean', ...options }),
  );
}
export function ApiPropertyOptionalBoolean(options: ApiPropertyOptions = {}) {
  return applyDecorators(
    IsBoolean(),
    IsOptional(),
    ApiPropertyOptional({ type: 'boolean', ...options }),
  );
}

export function ApiPropertyOptionalNotNullBoolean(
  options: ApiPropertyOptions = {},
) {
  return applyDecorators(
    NotEquals(null),
    ValidateIf((object, value) => value !== undefined),
    IsBoolean(),
    ApiPropertyOptional({ type: 'boolean', ...options }),
  );
}

export function ApiPropertyInt(
  options: ApiPropertyOptions = {},
  max = 2147483647,
  min = -2147483648,
) {
  return applyDecorators(
    IsInt(),
    Max(max),
    Min(min),
    ApiProperty({ type: 'integer', ...options }),
  );
}
export function ApiPropertyOptionalInt(
  options: ApiPropertyOptions = {},
  max = 2147483647,
  min = -2147483648,
) {
  return applyDecorators(
    IsInt(),
    IsOptional(),
    Max(max),
    Min(min),
    ApiPropertyOptional({ type: 'integer', ...options }),
  );
}

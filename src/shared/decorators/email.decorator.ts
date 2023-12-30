import { applyDecorators } from "@nestjs/common";
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  ValidationOptions,
} from "class-validator";
import { TransformEmail } from "../transformers/email.transformer";

export function ApiPropertyEmail(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {}
) {
  return applyDecorators(
    IsEmail({}, validationOptions),
    IsNotEmpty(),
    TransformEmail(),
    ApiProperty({ example: "mail@mail.ru", ...options })
  );
}
export function ApiPropertyOptionalEmail(
  options: ApiPropertyOptions = {},
  validationOptions: ValidationOptions = {}
) {
  return applyDecorators(
    IsEmail({}, validationOptions),
    IsOptional(),
    ApiPropertyOptional({ example: "mail@mail.ru", ...options })
  );
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity } from "typeorm";
import { MealTypeEnum } from "../enums/meal-type.enum";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { ApiProperty } from "@nestjs/swagger";
import {
  ApiPropertyInt,
  ApiPropertyString,
} from "src/shared/decorators/api.decorator";

interface IngredientInterface {
  name: string;
  value: number;
  metric: string;
}

@Entity("meals")
export class MealEntity extends AbstractEntity {
  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({
    type: () => MealTypeEnum,
    enum: MealTypeEnum,
    enumName: "meal_type_enum",
    example: MealTypeEnum.BREAKFAST,
  })
  @Column({ type: "enum", enum: MealTypeEnum, enumName: "meal_type_enum" })
  type: MealTypeEnum;

  @ApiPropertyString()
  @Column({ type: "text" })
  query: string;

  @ApiPropertyInt()
  @Column({ type: "int" })
  cookTime: number;

  @ApiPropertyString({ isArray: true })
  @Column({ type: "jsonb", array: true, default: [] })
  recipeSteps: string[];

  @ApiPropertyString({ isArray: true })
  @Column({ type: "jsonb", array: true, default: [] })
  microElements: string[];

  @ApiPropertyInt()
  @Column({ type: "int" })
  fats: number;

  @ApiPropertyInt()
  @Column({ type: "int" })
  carbo: number;

  @ApiPropertyInt()
  @Column({ type: "int" })
  protein: number;

  @ApiPropertyInt()
  @Column({ type: "int" })
  calories: number;

  @ApiPropertyString()
  @Column({ type: "text" })
  title: string;

  @ApiPropertyString()
  @Column({ type: "text" })
  description: string;

  @ApiProperty({ isArray: true })
  @Column({ type: "jsonb", array: true, default: [] })
  ingredients: IngredientInterface[];

  @ApiPropertyString()
  @Column({ type: "text" })
  image: string;
}

import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Entity } from "typeorm";

@Entity("meal_generate_plan")
export class MealGeneratePlanEntity extends AbstractEntity {}

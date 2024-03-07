import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealEntity } from "../entities/meal.entity";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from "typeorm";
import { Transactional } from "typeorm-transactional";
import { MealStatusEnum } from "../enums/meal-status.enum";

@Injectable()
export class MealService {
  constructor(
    @InjectRepository(MealEntity)
    private readonly mealRepository: Repository<MealEntity>
  ) {}

  @Transactional()
  async createBulk(meals: Partial<MealEntity>[]) {
    return await this.mealRepository.save(meals);
  }

  async find(options: FindManyOptions<MealEntity>) {
    return await this.mealRepository.find(options);
  }

  async findOne(options: FindOneOptions<MealEntity>): Promise<MealEntity> {
    return await this.mealRepository.findOne(options);
  }

  async update(id: string, meal: Partial<MealEntity>) {
    return await this.mealRepository.update(id, meal);
  }
}

import { Injectable } from "@nestjs/common";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  Repository,
} from "typeorm";
import { MealDayEntity } from "../entities/meal-day.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class MealDayService {
  constructor(
    @InjectRepository(MealDayEntity)
    private readonly mealGroupRepository: Repository<MealDayEntity>
  ) {}

  @Transactional()
  async createBulk(mealGroups: Partial<MealDayEntity>[]) {
    return await this.mealGroupRepository.insert(
      this.mealGroupRepository.create(mealGroups)
    );
  }

  async find(options: FindManyOptions<MealDayEntity>) {
    return await this.mealGroupRepository.find(options);
  }

  async findOne(options: FindOneOptions<MealDayEntity>) {
    return await this.mealGroupRepository.findOne(options);
  }

  @Transactional()
  async update(id: string, mealGroup: Partial<MealDayEntity>) {
    return await this.mealGroupRepository.update(id, mealGroup);
  }
}

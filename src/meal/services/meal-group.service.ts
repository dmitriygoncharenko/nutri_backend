import { Injectable } from "@nestjs/common";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptions,
  Repository,
} from "typeorm";
import { MealGroupEntity } from "../entities/meal-group.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class MealGroupService {
  constructor(
    @InjectRepository(MealGroupEntity)
    private readonly mealGroupRepository: Repository<MealGroupEntity>
  ) {}

  @Transactional()
  async createBulk(mealGroups: Partial<MealGroupEntity>[]) {
    return await this.mealGroupRepository.insert(
      this.mealGroupRepository.create(mealGroups)
    );
  }

  async find(options: FindManyOptions<MealGroupEntity>) {
    return await this.mealGroupRepository.find(options);
  }

  async findOne(options: FindOneOptions<MealGroupEntity>) {
    return await this.mealGroupRepository.findOne(options);
  }

  @Transactional()
  async update(id: string, mealGroup: Partial<MealGroupEntity>) {
    return await this.mealGroupRepository.update(id, mealGroup);
  }
}

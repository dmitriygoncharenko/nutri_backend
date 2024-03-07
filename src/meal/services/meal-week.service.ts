import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MealWeekEntity } from "../entities/meal-week.entity";
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { MealStatusEnum } from "../enums/meal-status.enum";

@Injectable()
export class MealWeekService {
  constructor(
    @InjectRepository(MealWeekEntity)
    private readonly mealWeekRepository: Repository<MealWeekEntity>
  ) {}

  @Transactional()
  async createBulk(
    mealWeeks: Partial<MealWeekEntity>[]
  ): Promise<MealWeekEntity[]> {
    return await this.mealWeekRepository.save(mealWeeks);
  }

  async find(where: FindOptionsWhere<MealWeekEntity>) {
    return await this.mealWeekRepository.find({ where });
  }

  async findOne(
    options: FindOneOptions<MealWeekEntity>
  ): Promise<MealWeekEntity> {
    return await this.mealWeekRepository.findOne(options);
  }

  async update(id: string, mealWeek: Partial<MealWeekEntity>) {
    return await this.mealWeekRepository.update(id, mealWeek);
  }
}

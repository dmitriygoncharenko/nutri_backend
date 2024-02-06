import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserWeightEntity } from "../entities/user-weight.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserWeightService {
  constructor(
    @InjectRepository(UserWeightEntity)
    private userWeightRepository: Repository<UserWeightEntity>
  ) {}

  async create(userId: string, weight: Partial<UserWeightEntity>) {
    return await this.userWeightRepository.save(
      this.userWeightRepository.create({ userId, ...weight })
    );
  }

  async findMany(userId: string) {
    return await this.userWeightRepository.find({
      where: { userId },
    });
  }

  async getLastWeight(userId: string) {
    const weights = await this.userWeightRepository.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
    return weights[0];
  }
}

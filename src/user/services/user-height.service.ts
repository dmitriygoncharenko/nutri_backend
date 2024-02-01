import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserWeightEntity } from "../entities/user-weight.entity";
import { Repository } from "typeorm";
import { UserHeightEntity } from "../entities/user-height.entity";

@Injectable()
export class UserHeightService {
  constructor(
    @InjectRepository(UserHeightEntity)
    private userHeightRepository: Repository<UserHeightEntity>
  ) {}

  async create(userId: string, height: Partial<UserHeightEntity>) {
    return await this.userHeightRepository.save(
      this.userHeightRepository.create({ userId, ...height })
    );
  }
}

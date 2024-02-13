import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../entities/subscription.entity";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SubscriptionTypeEnum } from "../enums/subscription-type.enum";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>
  ) {}
  async create(value: Partial<SubscriptionEntity>) {
    return await this.subscriptionRepository.save(
      this.subscriptionRepository.create(value)
    );
  }
  async findOne(where: FindOptionsWhere<SubscriptionEntity>) {
    return await this.subscriptionRepository.findOne({ where });
  }
  async update(subscriptionId: string, value: Partial<SubscriptionEntity>) {
    return await this.subscriptionRepository.update(subscriptionId, value);
  }
  async find(
    options: FindManyOptions<SubscriptionEntity>
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find(options);
  }

  async getSubsToGenerateMeal(value: {
    start: Date;
    end: Date;
  }): Promise<SubscriptionEntity[]> {
    const { start, end } = value;
    return await this.subscriptionRepository
      .createQueryBuilder("subscription")
      .leftJoinAndSelect(
        "subscription.meals",
        "meals",
        "meals.date BETWEEN :start AND :end",
        {
          start,
          end,
        }
      )
      .leftJoinAndSelect("subscription.user", "user")
      .leftJoinAndSelect("user.profile", "profile")
      .where("subscription.status = :status", {
        status: SubscriptionStatusEnum.PAID,
      })
      .getMany();
  }
}

import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../entities/subscription.entity";
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from "typeorm";
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
  async findOne(options: FindOneOptions<SubscriptionEntity>) {
    return await this.subscriptionRepository.findOne(options);
  }
  async update(subscriptionId: string, value: Partial<SubscriptionEntity>) {
    return await this.subscriptionRepository.update(subscriptionId, value);
  }
  async find(
    options: FindManyOptions<SubscriptionEntity>
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionRepository.find(options);
  }
}

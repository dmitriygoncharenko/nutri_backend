import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../entities/subscription.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

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
}

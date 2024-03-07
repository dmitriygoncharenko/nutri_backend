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
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { SubscriptionQueueEnum } from "../../queue/enums/subscription-queue.enum";
import { MealQueueEnum } from "src/queue/enums/meal-queue.enum";

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionRepository: Repository<SubscriptionEntity>,
    @InjectQueue(SubscriptionQueueEnum.SUBSCRIPTION_QUEUE)
    private subscriptionQueue: Queue
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

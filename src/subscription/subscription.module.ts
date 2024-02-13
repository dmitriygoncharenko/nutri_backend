import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionEntity } from "./entities/subscription.entity";
import { SubscriptionService } from "./services/subscription.service";

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionEntity])],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}

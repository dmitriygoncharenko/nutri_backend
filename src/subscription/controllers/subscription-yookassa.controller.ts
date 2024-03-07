import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { YookassaPaymentCallbackInterface } from "../interfaces/yookassa.interface";
import { YookassaService } from "../services/yookassa.service";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { InjectQueue } from "@nestjs/bullmq";
import { SubscriptionQueueEnum } from "src/queue/enums/subscription-queue.enum";
import { Queue } from "bullmq";

@ApiTags("Subscription Yookassa")
@Controller("subscription/yookassa")
export class SubscriptionYookassaController {
  constructor(
    private readonly yookassaService: YookassaService,
    private readonly subscriptionService: SubscriptionService,
    @InjectQueue(SubscriptionQueueEnum.SUBSCRIPTION_QUEUE)
    private readonly subscriptionQueue: Queue
  ) {}

  @Post("callback")
  @ApiOperation({
    summary: "yookassa payment callback",
  })
  @ApiResponse({ status: 200, description: "Success" })
  async callback(@Body() body: YookassaPaymentCallbackInterface) {
    try {
      console.log(
        "🚀 ~ SubscriptionYookassaController ~ callback ~ body:",
        body
      );
      const { object } = body;
      const payment = await this.yookassaService.getPayment(object.id);
      console.log(
        "🚀 ~ SubscriptionYookassaController ~ callback ~ payment:",
        payment
      );
      if (!payment) throw new BadRequestException("Payment not found");
      const subscription = await this.subscriptionService.findOne({
        where: { paymentId: payment.id },
      });
      if (!subscription)
        throw new BadRequestException("Subscription not found");
      if (subscription.status === SubscriptionStatusEnum.PAID) return;
      if (payment.status === "succeeded") {
        await this.subscriptionService.update(subscription.id, {
          status: SubscriptionStatusEnum.PAID,
        });
        await this.subscriptionQueue.add(
          "New paid subscription",
          subscription.id
        );
      } else if (payment.status === "canceled") {
        await this.subscriptionService.update(subscription.id, {
          status: SubscriptionStatusEnum.CANCELED,
        });
      } else {
        throw new BadRequestException("Payment has a wrong status");
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}

// In a processor file within the Meal module

import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
  InjectQueue,
} from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { SubscriptionQueueEnum } from "../enums/subscription-queue.enum";
import { UserService } from "src/user/services/user.service";
import { SubscriptionService } from "../../subscription/services/subscription.service";
import { SubscriptionEntity } from "../../subscription/entities/subscription.entity";
import { SubscriptionStatusEnum } from "../../subscription/enums/subscription-status.enum";
import { MealEntity } from "src/meal/entities/meal.entity";
import { MealWeekEntity } from "src/meal/entities/meal-week.entity";
import { MealWeekStatusEnum } from "src/meal/enums/meal-week-status.enum";
import { MealDayEntity } from "src/meal/entities/meal-day.entity";
import { OpenAIService } from "src/openai/services/openai.service";
import { userPrompt } from "src/openai/prompts/user.prompt";
import { MealDayStatusEnum } from "src/meal/enums/meal-day-status.enum";
import { MealStatusEnum } from "src/meal/enums/meal-status.enum";
import { MealWeekService } from "src/meal/services/meal-week.service";
import { MealQueueEnum } from "src/queue/enums/meal-queue.enum";
import { validateJob } from "../utilities/validate-job.utility";
import { SubscriptionTypeEnum } from "src/subscription/enums/subscription-type.enum";
import { YookassaService } from "src/subscription/services/yookassa.service";
import { numberSuffix } from "src/shared/utilities/number.utility";
import { TelegramService } from "src/telegram/services/telegram.service";
import { YookassaPaymentStatusEnum } from "src/subscription/enums/yookassa-payment-status.enum";

@Processor(SubscriptionQueueEnum.SUBSCRIPTION_PAYMENT_QUEUE)
export class SubscriptionPaymentProcessor extends WorkerHost {
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly openAiService: OpenAIService,
    private readonly telegramService: TelegramService,
    private readonly yookassaService: YookassaService,
    @InjectQueue(SubscriptionQueueEnum.SUBSCRIPTION_QUEUE)
    private subscriptionQueue: Queue
  ) {
    super();
  }
  async process(job: Job) {
    const subscriptionId = validateJob(job);
    console.log(
      "🚀 ~ SubscriptionPaymentProcessor ~ process ~ subscriptionId:",
      subscriptionId
    );

    const subscription = await this.subscriptionService.findOne({
      where: { id: subscriptionId },
      relations: ["user"],
    });

    if (subscription.status === SubscriptionStatusEnum.PAID) {
      await this.subscriptionQueue.add(
        "Proceed PAID subscription",
        subscription.id
      );
      return;
    }

    if (
      subscription.status === SubscriptionStatusEnum.CREATED &&
      subscription.type === SubscriptionTypeEnum.PAID
    ) {
      const caption = `Подписка NUTRINETIC на 1 неделю`;

      const payment = await this.yookassaService.createPayment(
        "990.00",
        caption,
        subscription.id,
        subscription.user
      );

      await this.subscriptionService.update(subscription.id, {
        paymentId: payment.id,
        status: SubscriptionStatusEnum.IN_PROGRESS,
      });

      await this.telegramService.sendMessageWithImage(
        caption,
        "https://s3.timeweb.com/28cccca7-a4a6083c-5d86-48e1-9443-f3e3a71dacd5/2ac2ec29-41e9-4670-9323-f827363499bd.webp",
        [
          {
            text: "Перейти на оплату",
            url: payment.confirmation.confirmation_url,
          },
        ],
        subscription.user.telegramId
      );

      await this.telegramService.sendMessage(764201935, "New invoice");

      return;
    }
  }
}

import { Injectable } from "@nestjs/common";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { UserEntity } from "src/user/entities/user.entity";
import { Context } from "grammy";
import { SubscriptionService } from "src/billing/services/subscription.service";
import { SubscriptionTypeEnum } from "src/billing/enums/subscription-type.enum";
import { PaymentMethodEnum } from "src/billing/enums/payment-method.enum";
import { UserService } from "src/user/services/user.service";
import { UserProfileService } from "src/user/services/user-profile.service";
import { SubscriptionStatusEnum } from "src/billing/enums/subscription-status.enum";
import { TelegramFlowEnum } from "../enums/telegram-flow.enum";

@Injectable()
export class TelegramPayFlowService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService
  ) {}

  getSteps(): TelegramFlowStepInterface[] {
    return [
      {
        key: TelegramFlowStateEnum.PAY_INIT,
        message: async () =>
          "Стоимость подписки на 4 недели 550.00₽. Подписка включает генерацию меню на каждый день в течении 4 недель. Выберите способ оплаты:",
        field: "payment_method",
        action: async (
          user: UserEntity,
          value: { payment_method: PaymentMethodEnum },
          ctx: Context
        ) => {
          const { payment_method } = value;
          await this.userProfileService.update(user.profileId, {
            payment_method,
          });

          const subscription = await this.subscriptionService.create({
            userId: user.id,
            type: SubscriptionTypeEnum.MENU,
            status: SubscriptionStatusEnum.CREATED,
            generations: 28,
          });

          const prices = [{ label: "4 недели", amount: 55000 }];

          ctx.api.sendInvoice(
            user.telegramId,
            "Оплата подписки на 4 недели (4 генерации меню)",
            "В рамках подписки вы сможете 4 раза сгенерировать меню на неделю, с помощью ИИ основываясь на вашем выборе опций.",
            subscription.id,
            "284685063:TEST:ZDYzZWRiMjI4MzZl",
            "RUB",
            prices
          );
          await this.userService.update(user.id, {
            telegramFlow: TelegramFlowEnum.DEFAULT,
            telegramState: TelegramFlowStateEnum.DEFAULT,
          });
        },
        buttons: [
          { label: "Российская карта", value: PaymentMethodEnum.RUSSIAN_CARD },
          {
            label: "Зарубежная карта",
            value: PaymentMethodEnum.INTERNATIONAL_CARD,
          },
        ],
      },
    ];
  }
}

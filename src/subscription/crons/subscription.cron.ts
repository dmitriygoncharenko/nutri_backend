import { Injectable } from "@nestjs/common";
import { SubscriptionService } from "../services/subscription.service";
import { SubscriptionStatusEnum } from "../enums/subscription-status.enum";
import { MealWeekEntity } from "src/meal/entities/meal-week.entity";
import { MealEntity } from "src/meal/entities/meal.entity";
import { Interval } from "@nestjs/schedule";
import { MealStatusEnum } from "src/meal/enums/meal-status.enum";
import { TelegramService } from "src/telegram/services/telegram.service";

@Injectable()
export class SubscriptionCron {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly telegramService: TelegramService
  ) {}

  @Interval(1000)
  async findExpired() {
    const subscriptions = await this.subscriptionService.find({
      where: { status: SubscriptionStatusEnum.PAID },
      relations: [
        "mealWeeks",
        "mealWeeks.mealDays",
        "mealWeeks.mealDays.meals",
      ],
    });
    for (let i = 0; i < subscriptions.length; i++) {
      const meals = subscriptions[i].mealWeeks.reduce(
        (acc: MealEntity[], current: MealWeekEntity) => {
          const days = current.mealDays;
          const meals = days.reduce((dayAcc, dayCurrent) => {
            return dayAcc.concat(dayCurrent.meals);
          }, []);
          return acc.concat(meals);
        },
        []
      );
      console.log("🚀 ~ SubscriptionCron ~ meals ~ meals:", meals);
      const statuses = Array(...new Set(meals.map((el) => el.status)));
      if (statuses.length === 1 && statuses[0] === MealStatusEnum.SENT) {
        // this.telegramService.sendStepMessage()
      }
    }
  }
}

import { InjectBot } from "@grammyjs/nestjs";
import { Bot, Context } from "grammy";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval } from "@nestjs/schedule";
import { UserService } from "src/user/services/user.service";
import { Between, In, IsNull, LessThanOrEqual, MoreThan, Not } from "typeorm";
import { SubscriptionService } from "src/subscription/services/subscription.service";
import { SubscriptionStatusEnum } from "src/subscription/enums/subscription-status.enum";
import { MealService } from "./meal.service";
import { MealEntity } from "../entities/meal.entity";
import { MealStatusEnum } from "../enums/meal-status.enum";
import { MealTypeEnum } from "../enums/meal-type.enum";
import { mealGenerationPrompt } from "src/openai/prompts/meal.prompt";
import { OpenAIService } from "src/openai/services/openai.service";
import {
  daysLeftInWeek,
  getDatesForTheRestOfWeek,
  getStartAndEndOfWeek,
} from "src/shared/utilities/date.utility";

@Injectable()
export class MealGenerateCron {
  public get bot(): Bot<Context> {
    return this._bot;
  }
  constructor(
    @InjectBot()
    private readonly _bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly mealService: MealService,
    private readonly openAiService: OpenAIService
  ) {}
  private readonly logger = new Logger(MealGenerateCron.name);

  @Interval(10000)
  async addMealsQueue() {
    try {
      const subscriptions =
        await this.subscriptionService.getSubsToGenerateMeal(
          getStartAndEndOfWeek()
        );
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];

        // Check if subscription is expired
        const spendedGenerations = Math.round(
          subscription?.meals.length /
            subscription.user.profile.mealTypes.length
        );
        if (spendedGenerations >= subscription.generations) {
          await this.subscriptionService.update(subscription.id, {
            status: SubscriptionStatusEnum.EXPIRED,
          });
          return;
        }

        const datesInWeek = getDatesForTheRestOfWeek(new Date());
        const datesToCreateMeals = datesInWeek.filter(
          (el) => !subscription.meals.map((m) => m.date).includes(el)
        );
        const newMeals: Partial<MealEntity>[] = [];
        datesToCreateMeals.forEach((date) => {
          subscription.user.profile?.mealTypes.forEach((type) => {
            newMeals.push({
              userId: subscription.user.id,
              status: MealStatusEnum.CREATED,
              type,
              date,
              subscriptionId: subscription.id,
            });
          });
        });
        await this.mealService.createBulk(newMeals);
      }
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Interval(20000)
  async generateMealWithAI() {
    this.logger.log("start generating meal with AI");
    const meals = await this.mealService.find({
      status: MealStatusEnum.CREATED,
    });
    const meal = meals[0];
    if (!meal) return;
    try {
      await this.mealService.update(meal.id, {
        status: MealStatusEnum.IN_PROGRESS,
      });
      const startTime = meal.createdAt;
      startTime.setHours(0, 0, 0, 0);
      const endTime = meal.createdAt;
      endTime.setHours(23, 59, 59, 999);
      const user = await this.userService.findOne({ id: meal.userId }, [
        "profile",
      ]);
      if (!user) return;
      if (!user.profile.metabolism) return;
      const userMealsForToday = await this.mealService.find({
        userId: user.id,
        createdAt: Between(startTime, endTime),
      });
      const createdCalories = userMealsForToday.reduce(
        (sum: number, el: MealEntity) => sum + el.calories,
        0
      );
      const eatenMealTypes = Array(
        ...userMealsForToday
          .filter((el) => el.status === MealStatusEnum.GENERATED)
          .reduce((types, meal) => {
            types.add(meal.type);
            return types;
          }, new Set<MealTypeEnum>())
      );
      const messages = mealGenerationPrompt(
        meal.type,
        createdCalories,
        eatenMealTypes,
        user
      );

      const response = await this.openAiService.chatGPT(messages, user.id);
      await this.mealService.update(meal.id, {
        ...meal,
        ...response,
        query: messages.map((el) => el.content).join("/ "),
        status: MealStatusEnum.GENERATED,
      });
    } catch (err) {
      await this.mealService.update(meal.id, {
        status: MealStatusEnum.CREATED,
      });
      this.logger.error(err);
    }
  }

  // @Interval(10000)
  async collectIngredients() {
    const meals = await this.mealService.find({});
    const ingredientList: Record<string, { value: number; metric: string[] }> =
      {};
    meals.forEach((el) => {
      el.ingredients.forEach((ing) => {
        if (ingredientList[ing.name]) {
          ingredientList[ing.name] = {
            value: ingredientList[ing.name].value + ing.quantity,
            metric: [...ingredientList[ing.name].metric, ing.metric],
          };
        } else {
          ingredientList[ing.name] = {
            value: ing.quantity,
            metric: [ing.metric],
          };
        }
      });
    });
    console.log(ingredientList);
  }
}

import { InjectBot } from "@grammyjs/nestjs";
import { Bot, Context } from "grammy";
import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { SubscriptionService } from "src/subscription/services/subscription.service";
import { SubscriptionStatusEnum } from "src/subscription/enums/subscription-status.enum";
import { MealStatusEnum } from "../enums/meal-status.enum";
import { OpenAIService } from "src/openai/services/openai.service";
import { MealGroupEntity } from "../entities/meal-group.entity";
import { MealGroupService } from "./meal-group.service";
import { MealGroupStatusEnum } from "../enums/meal-group-status.enum";
import { userPrompt } from "src/openai/prompts/user.prompt";

@Injectable()
export class MealGenerateCron {
  public get bot(): Bot<Context> {
    return this._bot;
  }
  constructor(
    @InjectBot()
    private readonly _bot: Bot<Context>,
    private readonly subscriptionService: SubscriptionService,
    private readonly openAiService: OpenAIService,
    private readonly mealGroupService: MealGroupService
  ) {}
  private readonly logger = new Logger(MealGenerateCron.name);

  @Interval(10000)
  async mealGroupsQueue() {
    const subscription = await this.subscriptionService.findOne({
      where: { status: SubscriptionStatusEnum.PAID },
      relations: ["user", "user.profile"],
    });

    if (!subscription) return;
    await this.subscriptionService.update(subscription.id, {
      status: SubscriptionStatusEnum.IN_PROGRESS,
    });
    try {
      const mealGroups: Partial<MealGroupEntity>[] = [];
      if (subscription.generations <= 0)
        throw new Error("Subs generation less or equil 0");

      for (let m = 0; m < Math.ceil(subscription.generations); m++) {
        if (!subscription.user?.profile?.metabolism)
          throw new Error("Metabolism not set");

        const threadId = await this.openAiService.createThread(
          userPrompt(subscription.user.profile)
        );

        const start = new Date(new Date().setHours(0, 0, 0, 0));
        start.setDate(start.getDate() + m);
        const end = new Date(start);
        end.setDate(start.getDate() + m + 1);
        mealGroups.push({
          start,
          end,
          threadId,
          subscriptionId: subscription.id,
        });
      }

      await this.mealGroupService
        .createBulk(mealGroups)
        .then(async () => {
          await this.subscriptionService.update(subscription.id, {
            status: SubscriptionStatusEnum.PROCESSED,
          });
        })
        .catch(console.log);
    } catch (err) {
      this.logger.error(err);
      await this.subscriptionService.update(subscription.id, {
        status: SubscriptionStatusEnum.FAILED,
      });
    }
  }

  // @Interval(20000)
  async checkSentMealGroups() {
    const mealGroups = await this.mealGroupService.find({
      where: { status: MealGroupStatusEnum.READY_TO_SEND },
      relations: ["meals"],
    });
    for (let mgIndex = 0; mgIndex < mealGroups.length; mgIndex++) {
      const mealsStatus = Array(
        ...new Set(mealGroups[mgIndex].meals.map((el) => el.status))
      );
      if (mealsStatus.length === 1 && mealsStatus[0] === MealStatusEnum.SENT) {
        // all meals was sent
        await this.mealGroupService.update(mealGroups[mgIndex].id, {
          status: MealGroupStatusEnum.COMPLETE,
        });
      }
    }
  }
}

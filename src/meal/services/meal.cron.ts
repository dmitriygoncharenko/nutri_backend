import { InjectBot } from "@grammyjs/nestjs";
import { Bot, Context } from "grammy";
import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { UserService } from "src/user/services/user.service";
import { SubscriptionService } from "src/subscription/services/subscription.service";
import { MealService } from "./meal.service";
import { MealEntity } from "../entities/meal.entity";
import { MealStatusEnum } from "../enums/meal-status.enum";
import { getMealTypeLabels } from "../enums/meal-type.enum";
import { OpenAIService } from "src/openai/services/openai.service";

import { formatDateToShortDate } from "src/shared/utilities/date.utility";
import { MealGroupService } from "./meal-group.service";
import { MealGroupStatusEnum } from "../enums/meal-group-status.enum";
import { OpenAIAssistantEnum } from "src/openai/enums/assistant.enum";
import { markdownToNodes } from "src/telegram/utilities/telegraph.utility";
import { TelegraphService } from "src/telegram/services/telegraph.service";

@Injectable()
export class MealGenerateCron {
  public get bot(): Bot<Context> {
    return this._bot;
  }
  constructor(
    @InjectBot()
    private readonly _bot: Bot<Context>,
    private readonly mealService: MealService,
    private readonly openAiService: OpenAIService,
    private readonly mealGroupService: MealGroupService,
    private readonly telegraphService: TelegraphService
  ) {}
  private readonly logger = new Logger(MealGenerateCron.name);

  @Interval(5000)
  async mealQueue() {
    const mealGroup = await this.mealGroupService.findOne({
      where: { status: MealGroupStatusEnum.CREATED },
      relations: [
        "subscription",
        "subscription.user",
        "subscription.user.profile",
      ],
    });

    if (!mealGroup) return;
    await this.mealGroupService.update(mealGroup.id, {
      status: MealGroupStatusEnum.MEALS_QUEUE,
    });

    try {
      const meals: Partial<MealEntity>[] = [];
      const date = new Date(mealGroup.start);
      mealGroup.subscription.user.profile.mealTypes.forEach((type) => {
        meals.push({
          userId: mealGroup.subscription.user.id,
          status: MealStatusEnum.CREATED,
          type,
          date,
          mealGroupId: mealGroup.id,
        });
      });
      await this.mealService.createBulk(meals);
      await this.mealGroupService.update(mealGroup.id, {
        status: MealGroupStatusEnum.MEALS_GENERATION,
      });
    } catch (err) {
      console.log(err);
      await this.mealGroupService.update(mealGroup.id, {
        status: MealGroupStatusEnum.FAILED,
        failMessage: String(err),
      });
    }
  }

  @Interval(5000)
  async generateMealWithAI() {
    this.logger.log("start generating meal with AI");
    const mealGroup = await this.mealGroupService.findOne({
      where: { status: MealGroupStatusEnum.MEALS_GENERATION },
      relations: ["meals"],
    });
    if (!mealGroup?.id) return;

    try {
      const meal = await this.mealService.findOne({
        where: { mealGroupId: mealGroup.id, status: MealStatusEnum.CREATED },
      });
      if (!meal?.id) return;
      await this.mealGroupService.update(mealGroup.id, {
        status: MealGroupStatusEnum.MEAL_GENERATING,
      });
      await this.mealService.update(meal.id, {
        status: MealStatusEnum.IN_PROGRESS,
      });

      await this.openAiService.addThreadMessage(mealGroup.threadId, {
        role: "user",
        content: meal.type,
      });
      const run = await this.openAiService.runAssistant(
        mealGroup.threadId,
        OpenAIAssistantEnum.NUTRI
      );
      await this.mealService.update(meal.id, { runId: run.id });
    } catch (err) {
      console.log(err);
      await this.mealGroupService.update(mealGroup.id, {
        status: MealGroupStatusEnum.FAILED,
        failMessage: String(err),
      });
    }
  }

  @Interval(5000)
  async checkRuns() {
    console.log("Check run");
    const mealGroup = await this.mealGroupService.findOne({
      where: { status: MealGroupStatusEnum.MEAL_GENERATING },
    });
    if (!mealGroup?.id) return;

    try {
      const meal = await this.mealService.findOne({
        where: {
          mealGroupId: mealGroup.id,
          status: MealStatusEnum.IN_PROGRESS,
        },
      });
      if (!meal?.id || !meal?.runId) {
        return;
      }
      const run = await this.openAiService.checkRun(
        mealGroup.threadId,
        meal.runId
      );

      if (run.status === "completed") {
        const messages = await this.openAiService.getThreadMessages(
          mealGroup.threadId
        );

        const message = messages.data[0];
        if (!message?.id) {
          throw new Error("Message from Assistant is not provided");
        }
        if (message.content[0].type !== "text") {
          throw new Error("Got not text response");
        }
        const response = message.content[0]?.text?.value;
        console.log("🚀 ~ MealGenerateCron ~ checkRuns ~ messages:", response);
        await this.mealService.update(meal.id, {
          response,
          messageId: message.id,
          status: MealStatusEnum.GENERATED,
        });
        await this.mealGroupService.update(mealGroup.id, {
          status: MealGroupStatusEnum.MEALS_GENERATION,
        });
      } else if (
        ["requires_action", "cancelled", "failed", "expired"].includes(
          run.status
        )
      ) {
        throw new Error("Wrong run status: " + run.status);
      }
    } catch (err) {
      console.log(err);
      await this.mealGroupService.update(mealGroup.id, {
        status: MealGroupStatusEnum.FAILED,
        failMessage: String(err),
      });
    }
  }

  // @Interval(20000)
  async sendMeal() {
    const meal = await this.mealService.findOne({
      where: { status: MealStatusEnum.GENERATED },
      relations: ["user"],
    });
    if (!meal?.id) return;

    try {
      const content = markdownToNodes(meal.response);
      const title = `${getMealTypeLabels()[meal.type]} ${formatDateToShortDate(
        meal.date
      )}`;
      const pageResult = await this.telegraphService.createPage({
        title,
        content,
      });
      if (!pageResult.ok) throw new Error("Page not created");
      await this.bot.api.sendMessage(
        meal.user.telegramId,
        pageResult.result.url
      );
      await this.mealService.update(meal.id, {
        status: MealStatusEnum.SENT,
        url: pageResult.result.url,
      });
    } catch (err) {
      console.log(err);
      await this.mealService.update(meal.id, {
        status: MealStatusEnum.SENT_FAILED,
      });
    }
  }
}

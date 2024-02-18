import { InjectBot } from "@grammyjs/nestjs";
import { Bot, Context } from "grammy";
import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { UserService } from "src/user/services/user.service";
import { SubscriptionService } from "src/subscription/services/subscription.service";
import { MealService } from "./meal.service";
import { MealStatusEnum } from "../enums/meal-status.enum";
import { OpenAIService } from "src/openai/services/openai.service";
import { MealGroupService } from "./meal-group.service";
import { MealGroupStatusEnum } from "../enums/meal-group-status.enum";
import { OpenAIAssistantEnum } from "src/openai/enums/assistant.enum";
import { TelegraphService } from "src/telegram/services/telegraph.service";

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
    private readonly openAiService: OpenAIService,
    private readonly mealGroupService: MealGroupService,
    private readonly telegraphService: TelegraphService
  ) {}
  private readonly logger = new Logger(MealGenerateCron.name);

  @Interval(10000)
  async findReadyForShoppingMealGroup() {
    const mealGroup = await this.mealGroupService.findOne({
      where: { status: MealGroupStatusEnum.MEAL_GENERATING },
      relations: ["meals"],
    });
    if (!mealGroup?.id) {
      return;
    }
    const mealsStatusList = Array(
      ...new Set(mealGroup.meals.map((el) => el.status))
    );
    if (
      mealsStatusList?.length === 1 &&
      mealsStatusList[0] === MealStatusEnum.GENERATED
    ) {
      await this.mealGroupService.update(mealGroup.id, {
        status: MealGroupStatusEnum.READY_FOR_SHOPPING,
      });
      return;
    }
  }

  @Interval(10000)
  async createShoppingList() {
    const mealGroup = await this.mealGroupService.findOne({
      where: { status: MealGroupStatusEnum.READY_FOR_SHOPPING },
    });
    if (!mealGroup?.id) return;
    await this.mealGroupService.update(mealGroup.id, {
      status: MealGroupStatusEnum.SHOPPING_LIST_IN_PROGRESS,
    });
    await this.openAiService.addThreadMessage(mealGroup.threadId, {
      role: "user",
      content: "Write shopping list of ingredients for that thread",
    });
    const run = await this.openAiService.runAssistant(
      mealGroup.threadId,
      OpenAIAssistantEnum.NUTRI
    );
    if (!run?.id) return;
    await this.mealGroupService.update(mealGroup.id, {
      shoppingListRunId: run.id,
      status: MealGroupStatusEnum.AWAITING_SHOPPING_LIST,
    });
  }

  @Interval(10000)
  async checkShoppingListRun() {
    const mealGroup = await this.mealGroupService.findOne({
      where: { status: MealGroupStatusEnum.AWAITING_SHOPPING_LIST },
      relations: ["subscription", "subscription.user"],
    });
    if (!mealGroup?.id) return;

    try {
      const run = await this.openAiService.checkRun(
        mealGroup.threadId,
        mealGroup.shoppingListRunId
      );

      if (run.status === "completed") {
        const messages = await this.openAiService.getThreadMessages(
          mealGroup.threadId
        );

        const message = messages.data[0];
        if (!message?.id) {
          throw new Error(
            "Shopping List run: Message from Assistant is not provided"
          );
        }
        if (message.content[0].type !== "text") {
          throw new Error("Got not text response");
        }
        const response = message.content[0]?.text?.value;
        console.log("🚀 ~ MealGenerateCron ~ checkRuns ~ messages:", response);
        await this.mealGroupService.update(mealGroup.id, {
          shoppingList: response,
          status: MealGroupStatusEnum.READY_TO_SEND,
        });
        // await this.bot.api.sendMessage(
        //   mealGroup.subscription.user.telegramId,
        //   response
        // );
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
}

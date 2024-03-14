import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { BulkJobOptions, Job, Queue } from "bullmq";
import { MealQueueEnum } from "../enums/meal-queue.enum";
import { validateJob } from "src/queue/utilities/validate-job.utility";
import { MealWeekService } from "../../meal/services/meal-week.service";
import { TelegramService } from "src/telegram/services/telegram.service";
import { numberSuffix } from "src/shared/utilities/number.utility";

@Processor(MealQueueEnum.MEAL_WEEK_INGREDIENTS_SEND_QUEUE)
export class MealWeekIngredientsSendProcessor extends WorkerHost {
  constructor(
    private readonly mealWeekService: MealWeekService,
    private readonly telegramService: TelegramService,
    @InjectQueue(MealQueueEnum.MEAL_SEND_QUEUE)
    private readonly mealSendQueue: Queue
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const mealWeekId = validateJob(job);
    console.log(
      "🚀 ~ MealWeekIngredientsSendProcessor ~ process ~ mealWeekId:",
      mealWeekId
    );
    const mealWeek = await this.mealWeekService.findOne({
      where: { id: mealWeekId },
      relations: ["user", "mealDays", "mealDays.meals"],
    });
    const dayCount = mealWeek.mealDays.length;
    const ingredientsMessage = `Список покупок на ${dayCount} ${numberSuffix(
      dayCount,
      ["день", "дня", "дней"]
    )}:\n
    ${mealWeek.ingredients
      .map((ing) => `${ing.name} - ${ing.quantity} ${ing.metric}`)
      .join("\n")}
    `;

    await this.telegramService.sendMessage(
      mealWeek.user.telegramId,
      ingredientsMessage
    );
    const mealJobs: {
      name: string;
      data: any;
      opts?: BulkJobOptions;
    }[] = [];

    mealWeek.mealDays.forEach((mealDay) => {
      mealDay.meals.forEach((meal, key) => {
        const delay =
          new Date(new Date(mealDay.date).setHours(0, 0, 0, 0)).getTime() -
          new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        mealJobs.push({
          name: `Send meal: ${meal.type}`,
          data: meal.id,
          opts: { delay },
        });
      });
    });
    await this.mealSendQueue.addBulk(mealJobs);
  }
}

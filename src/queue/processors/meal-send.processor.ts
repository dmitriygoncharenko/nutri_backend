import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { MealQueueEnum } from "../enums/meal-queue.enum";
import { OpenAIService } from "src/openai/services/openai.service";
import { MealEntity } from "../../meal/entities/meal.entity";
import { MealService } from "../../meal/services/meal.service";
import { MealStatusEnum } from "../../meal/enums/meal-status.enum";
import { OpenAIAssistantRunStatusEnum } from "src/openai/enums/openai-assistant-run-status.enum";
import { validateJob } from "src/queue/utilities/validate-job.utility";
import { MealWeekService } from "../../meal/services/meal-week.service";
import { IngredientInterface } from "../../meal/entities/meal-week.entity";
import { MealWeekStatusEnum } from "../../meal/enums/meal-week-status.enum";
import { S3Service } from "src/s3/s3.service";
import { markdownToNodes } from "src/telegram/utilities/telegraph.utility";
import {getMealTypeEmoji, getMealTypeLabels} from "../../meal/enums/meal-type.enum";
import { formatDateToShortDate } from "src/shared/utilities/date.utility";
import { TelegraphService } from "src/telegram/services/telegraph.service";
import { TelegramService } from "src/telegram/services/telegram.service";
import { getImageUrl } from "src/s3/s3.utility";

@Processor(MealQueueEnum.MEAL_SEND_QUEUE)
export class MealSendProcessor extends WorkerHost {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly mealService: MealService,
    private readonly mealWeekService: MealWeekService,
    private readonly s3Service: S3Service,
    private readonly telegraphService: TelegraphService,
    private readonly telegramService: TelegramService
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const mealId = validateJob(job);
    console.log("🚀 ~ MealSendProcessor ~ process ~ mealId:", mealId);
    const meal = await this.mealService.findOne({
      where: { id: mealId },
      relations: ["user"],
    });

    const content = markdownToNodes(meal.response);
    const title = `${getMealTypeEmoji()[meal.type]} ${getMealTypeLabels()[meal.type]} ${formatDateToShortDate(
      new Date()
    )}`;
    const pageResult = await this.telegraphService.createPage({
      title,
      content,
    });
    if (!pageResult.ok) throw new Error("Page not created");



    await this.telegramService.sendMessageWithImage(
      title,
      getImageUrl(`${meal.id}.png`),
      [{ text: "Открыть рецепт", url: pageResult.result.url }],
      meal.user.telegramId
    );
    await this.mealService.update(meal.id, {
      status: MealStatusEnum.SENT,
      url: pageResult.result.url,
    });
  }
}

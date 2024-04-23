import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { MealQueueEnum } from "../enums/meal-queue.enum";
import { OpenAIService } from "src/openai/services/openai.service";
import { MealService } from "../../meal/services/meal.service";
import { MealStatusEnum } from "../../meal/enums/meal-status.enum";
import { OpenAIAssistantRunStatusEnum } from "src/openai/enums/openai-assistant-run-status.enum";
import { validateJob } from "src/queue/utilities/validate-job.utility";
import { S3Service } from "src/s3/s3.service";
import {NotionService} from "../../notion/notion.service";
import {getMealTypeEmoji, getMealTypeLabels} from "../../meal/enums/meal-type.enum";
import {getImageUrl} from "../../s3/s3.utility";

@Processor(MealQueueEnum.MEAL_QUEUE)
export class MealRunProcessor extends WorkerHost {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly mealService: MealService,
    @InjectQueue(MealQueueEnum.MEAL_QUEUE)
    private mealQueue: Queue,
    private readonly s3Service: S3Service,
    @InjectQueue(MealQueueEnum.MEAL_SEND_QUEUE)
    private readonly mealSendQueue: Queue,
    private readonly notionService: NotionService,
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const mealId = validateJob(job);
    console.log("🚀 ~ MealRunProcessor ~ process ~ mealId:", mealId);

    const meal = await this.mealService.findOne({
      where: { id: mealId },
      relations: ["mealDay"],
    });

    const run = await this.openAiService.checkRun(
      meal.mealDay.threadId,
      meal.runId
    );

    if (run.status === OpenAIAssistantRunStatusEnum.COMPLETED) {
      const messages = await this.openAiService.getThreadMessages(
        meal.mealDay.threadId
      );

      const message = messages.data[0];
      if (!message?.id) {
        throw new Error("Message from assistant is not provided");
      }
      if (message.content[0].type !== "text") {
        throw new Error("Got not text response from assistant");
      }
      const response = message.content[0]?.text?.value;
      await this.mealService.update(meal.id, {
        response,
        messageId: message.id,
        status: MealStatusEnum.GENERATED,
      });

      // GENERATE IMAGE
      const imageBase64 = await this.openAiService.createImage(
        `Create a realistic photo of meal based on recipe description in instagram style: ${response}`
      );
      await this.s3Service.uploadFile(`${meal.id}.png`, imageBase64);

      await this.notionService.createPage(
          '2e829300cf1744f9b6faf2577db136b6',
          getMealTypeLabels()[meal.type],
          getImageUrl(`${meal.id}.png`),
          getMealTypeEmoji()[meal.type],
          meal.response,
          meal.mealDay.date
      )
      return;
    }

    if (
      [
        OpenAIAssistantRunStatusEnum.IN_PROGRESS,
        OpenAIAssistantRunStatusEnum.QUEUED,
      ].includes(run.status)
    ) {
      await this.mealQueue.add("Still running", meal.id, { delay: 10000 });
    }

    if (
      [
        OpenAIAssistantRunStatusEnum.REQUIRES_ACTION,
        OpenAIAssistantRunStatusEnum.CANCELLED,
        OpenAIAssistantRunStatusEnum.FAILED,
        OpenAIAssistantRunStatusEnum.EXPIRED,
      ].includes(run.status)
    ) {
      await this.mealService.update(meal.id, {
        status: MealStatusEnum.FAILED,
        failMessage: `Wrong status for run ${run.status}`,
      });
      return;
    }
  }
}

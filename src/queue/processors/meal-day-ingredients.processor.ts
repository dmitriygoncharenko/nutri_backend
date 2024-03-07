import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { MealQueueEnum } from "../enums/meal-queue.enum";
import { MealDayService } from "../../meal/services/meal-day.service";
import { validateJob } from "src/queue/utilities/validate-job.utility";
import { OpenAIService } from "src/openai/services/openai.service";
import { OpenAIAssistantEnum } from "src/openai/enums/assistant.enum";
import { MealDayStatusEnum } from "../../meal/enums/meal-day-status.enum";
import { OpenAIAssistantRunStatusEnum } from "src/openai/enums/openai-assistant-run-status.enum";

@Processor(MealQueueEnum.MEAL_DAY_INGREDIENTS_QUEUE)
export class MealDayIngredientsProcessor extends WorkerHost {
  constructor(
    private readonly mealDayService: MealDayService,
    private readonly openAiService: OpenAIService,
    @InjectQueue(MealQueueEnum.MEAL_WEEK_INGREDIENTS_QUEUE)
    private mealWeekIngredientsQueue: Queue,
    @InjectQueue(MealQueueEnum.MEAL_DAY_INGREDIENTS_QUEUE)
    private mealDayIngredientsQueue: Queue
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const mealDayId = validateJob(job, "string");
    console.log(
      "🚀 ~ MealDayIngredientsProcessor ~ process ~ mealDayId:",
      mealDayId
    );

    const mealDay = await this.mealDayService.findOne({
      where: { id: mealDayId },
    });

    // IF INGREDIENTS AREN'T RUNNING
    if (mealDay.status === MealDayStatusEnum.GENERATED) {
      await this.openAiService.addThreadMessage(mealDay.threadId, {
        role: "user",
        content: "Write shopping list of ingredients for that thread",
      });
      const run = await this.openAiService.runAssistant(
        mealDay.threadId,
        OpenAIAssistantEnum.NUTRI
      );

      await this.mealDayService.update(mealDay.id, {
        ingredientsRunId: run.id,
        status: MealDayStatusEnum.INGREDIENTS_RUNNING,
      });
      await this.mealDayIngredientsQueue.add(
        "Check day ingredients run",
        mealDay.id,
        { delay: 10000 }
      );
      return;
    }

    // IF INGREDIENTS ARE RUNNING ALREADY
    if (mealDay.status === MealDayStatusEnum.INGREDIENTS_RUNNING) {
      const run = await this.openAiService.checkRun(
        mealDay.threadId,
        mealDay.ingredientsRunId
      );

      // IF COMPLETED
      if (run.status === OpenAIAssistantRunStatusEnum.COMPLETED) {
        const messages = await this.openAiService.getThreadMessages(
          mealDay.threadId
        );

        const message = messages.data[0];
        if (!message?.id) {
          throw new Error("Message from Assistant is not provided");
        }
        if (message.content[0].type !== "text") {
          throw new Error("Got not text response");
        }
        const response = message.content[0]?.text?.value;
        await this.mealDayService.update(mealDay.id, {
          ingredients: response,
          status: MealDayStatusEnum.INGREDIENTS_GENERATED,
        });

        // IF ALL DAYS INGREDIENTS IN A WEEK ARE GENERATED
        const mealDays = await this.mealDayService.find({
          where: { mealWeekId: mealDay.mealWeekId },
        });
        const uniqueStatus = Array(...new Set(mealDays.map((el) => el.status)));
        if (
          uniqueStatus.length === 1 &&
          uniqueStatus.includes(MealDayStatusEnum.INGREDIENTS_GENERATED)
        ) {
          await this.mealWeekIngredientsQueue.add("", mealDay.mealWeekId);
        }

        return;
      }

      // IF IN PROGRESS
      if (
        [
          OpenAIAssistantRunStatusEnum.IN_PROGRESS,
          OpenAIAssistantRunStatusEnum.QUEUED,
        ].includes(run.status)
      ) {
        await this.mealDayIngredientsQueue.add(
          "Check ingredients run again",
          mealDay.id,
          { delay: 10000 }
        );
      }

      // IF FAILED
      if (
        [
          OpenAIAssistantRunStatusEnum.REQUIRES_ACTION,
          OpenAIAssistantRunStatusEnum.CANCELLED,
          OpenAIAssistantRunStatusEnum.FAILED,
          OpenAIAssistantRunStatusEnum.EXPIRED,
        ].includes(run.status)
      ) {
        throw new Error("Wrong run status: " + run.status);
      }
    }
  }
}

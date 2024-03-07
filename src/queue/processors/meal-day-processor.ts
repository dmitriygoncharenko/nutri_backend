// In a processor file within the Meal module

import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
  InjectQueue,
} from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { OpenAIService } from "src/openai/services/openai.service";
import { MealDayStatusEnum } from "src/meal/enums/meal-day-status.enum";
import { MealStatusEnum } from "src/meal/enums/meal-status.enum";
import { MealQueueEnum } from "src/queue/enums/meal-queue.enum";
import { MealService } from "../../meal/services/meal.service";
import { MealDayService } from "../../meal/services/meal-day.service";
import { OpenAIAssistantEnum } from "src/openai/enums/assistant.enum";
import { validateJob } from "src/queue/utilities/validate-job.utility";

@Processor(MealQueueEnum.MEAL_DAY_QUEUE)
export class MealDayProcessor extends WorkerHost {
  constructor(
    private readonly mealService: MealService,
    private readonly mealDayService: MealDayService,
    private readonly openAiService: OpenAIService,
    @InjectQueue(MealQueueEnum.MEAL_QUEUE)
    private mealQueue: Queue,
    @InjectQueue(MealQueueEnum.MEAL_DAY_QUEUE)
    private mealDayQueue: Queue,
    @InjectQueue(MealQueueEnum.MEAL_DAY_INGREDIENTS_QUEUE)
    private mealDayIngredientsQueue: Queue
  ) {
    super();
  }
  async process(job: Job) {
    const mealDayId = validateJob(job);
    console.log("🚀 ~ MealDayProcessor ~ process ~ mealDayId:", mealDayId);

    const mealDay = await this.mealDayService.findOne({
      where: { id: mealDayId },
      relations: ["meals"],
    });

    const mealStatuses: MealStatusEnum[] = mealDay.meals.map((el) => el.status);
    const mealUniqueStatuses = Array(...new Set(mealStatuses));

    // IF ALL MEALS ARE GENERATED
    if (
      mealUniqueStatuses.length === 1 &&
      mealUniqueStatuses.includes(MealStatusEnum.GENERATED)
    ) {
      await this.mealDayService.update(mealDay.id, {
        status: MealDayStatusEnum.GENERATED,
      });

      await this.mealDayIngredientsQueue.add(
        "Genrate day ingredients",
        mealDay.id
      );
      return;
    }

    // IF RUNNING MEAL DOESN'T EXIST, RUN NEXT MEAL TO GENERATE
    if (!mealStatuses.includes(MealStatusEnum.RUNNING)) {
      const nextMealToGenerate = mealDay.meals.find(
        (el) => el.status === MealStatusEnum.CREATED
      );
      if (!nextMealToGenerate)
        throw new Error("Can't find next meal to generate");

      await this.openAiService.addThreadMessage(mealDay.threadId, {
        role: "user",
        content: nextMealToGenerate.type,
      });
      const run = await this.openAiService.runAssistant(
        mealDay.threadId,
        OpenAIAssistantEnum.NUTRI
      );
      await this.mealService.update(nextMealToGenerate.id, {
        runId: run.id,
        status: MealStatusEnum.RUNNING,
      });
      await this.mealQueue.add("Check meal run", nextMealToGenerate.id);
      await this.mealDayQueue.add("Run next meal to generate", mealDay.id, {
        delay: 1000,
      });
      return;
    }

    // IF RUNNING EXISTS
    if (mealStatuses.includes(MealStatusEnum.RUNNING)) {
      await this.mealDayQueue.add("Running meal existing", mealDay.id, {
        delay: 1000,
      });
      return;
    }
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job) {
    // console.log("complete jb", job);
  }
}

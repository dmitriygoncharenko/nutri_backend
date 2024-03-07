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

@Processor(MealQueueEnum.MEAL_WEEK_INGREDIENTS_QUEUE)
export class MealWeekIngredientsProcessor extends WorkerHost {
  constructor(
    private readonly openAiService: OpenAIService,
    private readonly mealWeekService: MealWeekService,
    @InjectQueue(MealQueueEnum.MEAL_WEEK_INGREDIENTS_SEND_QUEUE)
    private readonly mealWeekIngredientsSendProcessor: Queue
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    const mealWeekId = validateJob(job);
    console.log(
      "🚀 ~ MealWeekIngredientsProcessor ~ process ~ mealWeekId:",
      mealWeekId
    );

    const mealWeek = await this.mealWeekService.findOne({
      where: { id: mealWeekId },
      relations: ["mealDays"],
    });
    const mealDaysIngredients = mealWeek.mealDays
      .map((el) => el.ingredients)
      .join(";\n");

    const { ingredients } = (await this.openAiService.chatGPT([
      {
        role: "system",
        content:
          "Analyze the user's message to identify and list all unique ingredients mentioned. For each ingredient, summarize the total quantity and specify the unit of measurement. Format the response as a JSON array where each element is an object. Each object should contain the following attributes: 'name' for the ingredient's name, 'quantity' for the total amount, and 'metric' for the unit of measurement (like spoon, gram, liter, ml, oz, etc.). Ensure that the array is well-structured and accurately reflecting the details for each unique ingredient.",
      },
      { role: "user", content: mealDaysIngredients },
    ])) as unknown as { ingredients: IngredientInterface[] };

    await this.mealWeekService.update(mealWeek.id, {
      ingredients,
      status: MealWeekStatusEnum.GENERATED,
    });
    await this.mealWeekIngredientsSendProcessor.add(
      "Send week ingredients",
      mealWeek.id
    );
  }
}

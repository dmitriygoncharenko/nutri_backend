// In a processor file within the Meal module

import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
  InjectQueue,
} from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { SubscriptionQueueEnum } from "../enums/subscription-queue.enum";
import { UserService } from "src/user/services/user.service";
import { SubscriptionService } from "../../subscription/services/subscription.service";
import { SubscriptionEntity } from "../../subscription/entities/subscription.entity";
import { SubscriptionStatusEnum } from "../../subscription/enums/subscription-status.enum";
import { MealEntity } from "src/meal/entities/meal.entity";
import { MealWeekEntity } from "src/meal/entities/meal-week.entity";
import { MealWeekStatusEnum } from "src/meal/enums/meal-week-status.enum";
import { MealDayEntity } from "src/meal/entities/meal-day.entity";
import { OpenAIService } from "src/openai/services/openai.service";
import { userPrompt } from "src/openai/prompts/user.prompt";
import { MealDayStatusEnum } from "src/meal/enums/meal-day-status.enum";
import { MealStatusEnum } from "src/meal/enums/meal-status.enum";
import { MealWeekService } from "src/meal/services/meal-week.service";
import { MealQueueEnum } from "src/queue/enums/meal-queue.enum";
import { validateJob } from "../utilities/validate-job.utility";

@Processor(SubscriptionQueueEnum.SUBSCRIPTION_QUEUE)
export class SubscriptionProcessor extends WorkerHost {
  constructor(
    private readonly userService: UserService,
    private readonly subscriptionService: SubscriptionService,
    private readonly openAiService: OpenAIService,
    private readonly mealWeekService: MealWeekService,
    @InjectQueue(MealQueueEnum.MEAL_DAY_QUEUE)
    private mealDayQueue: Queue
  ) {
    super();
  }
  async process(job: Job) {
    const subscriptionId = validateJob(job);
    console.log(
      "🚀 ~ SubscriptionProcessor ~ process ~ subscriptionId:",
      subscriptionId
    );

    const subscription = await this.subscriptionService.findOne({
      where: { id: subscriptionId },
      relations: ["user", "user.profile"],
    });

    const threadIds = await Promise.all(
      Array.from(Array(subscription.generations).keys()).map(() =>
        this.openAiService.createThread(userPrompt(subscription.user.profile))
      )
    );

    let currentDate = new Date(subscription.createdAt);
    let daysLeft = subscription.generations;

    const mealWeeks: Partial<MealWeekEntity>[] = Array.from(
      Array(Math.ceil(subscription.generations / 7)).keys()
    ).map(() => {
      const daysInThisWeek = daysLeft >= 7 ? 7 : daysLeft;
      const mealWeek = new MealWeekEntity();

      mealWeek.userId = subscription.user.id;
      mealWeek.start = new Date(currentDate);
      mealWeek.end = new Date(
        currentDate.getTime() + (daysInThisWeek - 1) * 24 * 60 * 60 * 1000
      );
      mealWeek.status = MealWeekStatusEnum.CREATED;
      mealWeek.subscriptionId = subscription.id;
      mealWeek.mealDays = threadIds
        .splice(0, daysInThisWeek)
        .map((threadId, key) => {
          console.log(
            "🚀 ~ SubscriptionProcessor ~ .map ~ threadId:",
            threadId
          );
          const mealDay = new MealDayEntity();
          mealDay.date = new Date(
            currentDate.getTime() + key * 24 * 60 * 60 * 1000
          );
          mealDay.threadId = threadId;
          mealDay.status = MealDayStatusEnum.CREATED;
          mealDay.meals = subscription.user.profile.mealTypes.map((mt) => {
            const meal = new MealEntity();
            meal.status = MealStatusEnum.CREATED;
            meal.type = mt;
            meal.userId = subscription.user.id;
            return meal;
          });
          return mealDay;
        }) as MealDayEntity[];
      currentDate = new Date(mealWeek.end.getTime() + 24 * 60 * 60 * 1000);
      daysLeft -= daysInThisWeek;

      return mealWeek;
    });
    console.log(
      "🚀 ~ SubscriptionProcessor ~ process ~ mealWeeks:",
      mealWeeks,
      mealWeeks[0]?.mealDays
    );
    const mealWeeksCreated = await this.mealWeekService.createBulk(mealWeeks);

    mealWeeksCreated.forEach(async (mwCreated, mwKey) => {
      const now = new Date();
      const start = new Date(mwCreated.start);
      const delay = start.getTime() - now.getTime();

      await this.mealDayQueue.addBulk(
        mwCreated.mealDays.map((mealDay) => {
          const dayDelay = delay + mwKey * 86400000;
          return {
            name: "",
            data: mealDay.id,
            opts: { delay: dayDelay > 0 ? dayDelay : 0 },
          };
        })
      );
    });
  }
}

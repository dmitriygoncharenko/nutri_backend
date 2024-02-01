import { Bot, Context, InlineKeyboard, Keyboard } from "grammy";
import {
  InjectBot,
  Update,
  Start,
  Hears,
  Ctx,
  Command,
  On,
} from "@grammyjs/nestjs";
import { UserService } from "src/user/services/user.service";
import { TelegramFlowKeyEnum } from "./enums/telegram-flow-key.enum";
import { TelegramOnboardingFlowService } from "./flows/onboarding-flow.service";
import { BadRequestException } from "@nestjs/common";
import { UserProfileService } from "src/user/services/user-profile.service";

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly telegramOnboardingFlowService: TelegramOnboardingFlowService
  ) {}

  async handleUserReply(telegramId: number, value: string, ctx: Context) {
    try {
      const steps = this.telegramOnboardingFlowService.getSteps();
      const user = await this.userService.findOne({ telegramId });
      if (!user) throw new BadRequestException({ message: "User not found" });
      const index = steps.findIndex((el) => el.key === user.telegramState);
      if (index >= 0) {
        const currentStep = steps[index];
        if (!currentStep.action) return;
        await currentStep.action(user.id, {
          [currentStep.field]: value,
        });

        const nextStep = steps[index + 1];
        if (!nextStep)
          throw new BadRequestException({ message: "No more steps" });
        if (nextStep?.buttons?.length) {
          await ctx.api.sendMessage(telegramId, nextStep.message, {
            reply_markup: InlineKeyboard.from([
              nextStep.buttons.map((el) =>
                InlineKeyboard.text(el.label, el.value)
              ),
            ]),
          });
        } else if (nextStep?.poll) {
          ctx.api.sendPoll(telegramId, nextStep.message, nextStep.poll.values, {
            ...nextStep.poll.options,
            protect_content: true,
          });
        } else {
          await ctx.api.sendMessage(telegramId, nextStep.message, {
            reply_markup: currentStep.poll
              ? undefined
              : {
                  force_reply: true,
                },
          });
        }
        await this.userService.update(user.id, { telegramState: nextStep.key });
      }
    } catch (err) {
      ctx.api.sendMessage(
        telegramId,
        `Произошла ошибка: ${err?.message || "500"}. Попробуйте ещё раз.`
      );
    }
  }

  async sendMessage(userId: number, message: string): Promise<void> {
    try {
      await this.bot.api.sendMessage(userId, message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error("Failed to send message");
    }
  }

  async sendRecipe() {
    // const photoURL = `https://s3.timeweb.com/28cccca7-a4a6083c-5d86-48e1-9443-f3e3a71dacd5/${recipe.image}`;
    // const caption = `## ${recipe.recipeDescription}`;
    // const reply_markup = {
    //   inline_keyboard: [
    //     [
    //       {
    //         text: "Open Recipe",
    //         url: `https://roxyai.space/recipe/${recipe.id}`, // Link URL
    //       },
    //     ],
    //   ],
    // };
    // try {
    //   await this.bot.api.sendPhoto(userId, photoURL, { caption, reply_markup });
    // } catch (error) {
    //   console.error("Error sending photo:", error);
    // }
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    try {
      const {
        id: telegramId,
        username: telegramUsername,
        first_name,
        last_name,
      } = ctx.update.message.from;
      let user = await this.userService.findOne({ telegramId });
      if (!user) {
        user = await this.userService.create({ telegramId, telegramUsername });
        await this.userProfileService.create(user.id, {
          fullname: `${first_name} ${last_name}`,
        });
      }
      user = await this.userService.update(user.id, {
        telegramState: TelegramFlowKeyEnum.START,
      });
      const steps = this.telegramOnboardingFlowService.getSteps();
      const index = steps.findIndex((el) => el.key === user.telegramState);
      if (index < 0)
        throw new BadRequestException({ message: "Error on start" });
      ctx.api.sendMessage(telegramId, steps[index].message);
    } catch (err) {
      console.log(err);
    }
  }
  @On("callback_query")
  async onCallbackQuery(ctx: Context) {
    const { id } = ctx.update.callback_query.from;
    this.handleUserReply(id, ctx.update.callback_query.data, ctx);
  }

  @On("message")
  async onMessage(ctx: Context) {
    const { id } = ctx.update.message.from;
    this.handleUserReply(id, ctx.message.text, ctx);
  }

  @On("poll_answer")
  async onPollAnswer(ctx: Context) {
    const { id } = ctx.pollAnswer.user;
    try {
      const steps = await this.telegramOnboardingFlowService.getSteps();
      const user = await this.userService.findOne({ telegramId: id });
      if (!user)
        throw new BadRequestException({ message: "Пользователь не найден" });
      const index = steps.findIndex((el) => el.key === user.telegramState);
      if (index < 0)
        throw new BadRequestException({ message: "Индекс шага не найден" });
      const currentStep = steps[index];
      const answers = currentStep.poll?.values.filter((el, key) =>
        ctx.pollAnswer.option_ids.includes(key)
      );
      if (answers?.length > 0) {
        this.handleUserReply(id, answers.join("; "), ctx);
      }
    } catch (err) {
      ctx.api.sendMessage(
        id,
        `Произошла ошибка: ${err?.message || "500"}. Попробуйте ещё раз.`
      );
    }
  }
}

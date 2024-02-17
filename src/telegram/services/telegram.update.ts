import { Bot, Context, InlineKeyboard, InputFile, Keyboard } from "grammy";
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
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { BadRequestException } from "@nestjs/common";
import { UserProfileService } from "src/user/services/user-profile.service";
import { createReadStream } from "fs";
import { TelegramFlowCommandEnum } from "../enums/telegram-flow-command.enum";
import { TelegramFlowService } from "../flows/telegram-flow.service";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramFlowEnum } from "../enums/telegram-flow.enum";
import { UserEntity } from "src/user/entities/user.entity";
import { SubscriptionService } from "src/subscription/services/subscription.service";
import { SubscriptionStatusEnum } from "src/subscription/enums/subscription-status.enum";
import { Interval } from "@nestjs/schedule";

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly userProfileService: UserProfileService,
    private readonly telegramFlowService: TelegramFlowService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  async skipStepsAndFindNext(
    index: number,
    steps: TelegramFlowStepInterface[],
    user: UserEntity
  ) {
    if (!steps[index])
      throw new BadRequestException({ message: "Шаг для проверки не найден" });
    if (steps[index].skipStep && (await steps[index].skipStep(user))) {
      return await this.skipStepsAndFindNext(index + 1, steps, user);
    } else {
      return index;
    }
  }

  async sendMessage(
    telegramId: number,
    user: UserEntity,
    step: TelegramFlowStepInterface,
    ctx: Context
  ) {
    if (!step) throw new BadRequestException({ message: "No more steps" });
    if (!step.message) return;
    const message = await step.message(user);
    if (!message) {
      // I setup another flow if message undefined or null
      this.handleUserReply(telegramId, ctx);
    }
    if (step?.buttons?.length) {
      await ctx.api.sendMessage(telegramId, message, {
        reply_markup: InlineKeyboard.from([
          step.buttons.map((el) => InlineKeyboard.text(el.label, el.value)),
        ]),
      });
    } else if (step?.poll) {
      ctx.api.sendPoll(telegramId, message, step.poll.values, {
        ...step.poll.options,
        is_anonymous: false,
        protect_content: true,
      });
    } else if (step.file) {
      await ctx.api.sendVideo(
        telegramId,
        new InputFile(createReadStream(step.file.url)),
        { caption: message }
      );
    } else {
      await ctx.api.sendMessage(telegramId, message);
    }
  }

  async handleUserReply(
    telegramId: number,
    ctx: Context,
    value?: string | string[]
  ) {
    try {
      let user = await this.userService.findOne({ telegramId });
      if (!user) throw new BadRequestException({ message: "User not found" });
      if (user.telegramFlow === TelegramFlowEnum.DEFAULT) return;

      const steps = this.telegramFlowService.getFlowSteps(user.telegramFlow);
      let currentStep = null;
      let nextStep = null;
      let index = 0;
      // Check if user just have started some flow
      if (user.telegramState === TelegramFlowStateEnum.DEFAULT) {
        index = await this.skipStepsAndFindNext(index, steps, user);
        currentStep = steps[index];
        user = await this.userService.update(user.id, {
          telegramState: currentStep.key,
        });
        await this.sendMessage(telegramId, user, currentStep, ctx);
        return;
      }

      // If not, then let's find current step index
      index = steps.findIndex((el) => el.key === user.telegramState);

      if (index < 0)
        throw new BadRequestException({ message: "Шаг не найден" });

      currentStep = steps[index];

      // Collect poll answers
      if (currentStep.poll) {
        value = currentStep.poll?.values.filter((el, key) =>
          ctx.pollAnswer.option_ids.includes(key)
        );
      }

      if (currentStep.action) {
        await currentStep.action(
          user,
          {
            [currentStep.field]: value,
          },
          ctx
        );
      }
      if (index + 1 === steps.length) {
        // If next step is the last - set user flow to default state
        await this.userService.update(user.id, {
          telegramFlow: TelegramFlowEnum.DEFAULT,
          telegramState: TelegramFlowStateEnum.DEFAULT,
        });
      } else {
        index = index + 1;
        index = await this.skipStepsAndFindNext(index, steps, user);
        console.log("🚀 ~ TelegramUpdate ~ index:", index);
        nextStep = steps[index];
        await this.userService.update(user.id, {
          telegramState: nextStep.key,
        });
        this.sendMessage(telegramId, user, nextStep, ctx);
      }
    } catch (err) {
      ctx.api.sendMessage(
        telegramId,
        `Произошла ошибка: ${err?.message || "500"}. Попробуйте ещё раз.`
      );
    }
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
        user = await this.userService.create({
          telegramId,
          telegramUsername,
          profile: { telegramName: `${first_name} ${last_name}` },
        });
      }
      await this.userService.update(user.id, {
        telegramFlow: TelegramFlowEnum.START,
        telegramState: TelegramFlowStateEnum.DEFAULT,
      });
      this.handleUserReply(telegramId, ctx);
    } catch (err) {
      console.log(err);
    }
  }
  @On("callback_query")
  async onCallbackQuery(ctx: Context) {
    const { id } = ctx.update.callback_query.from;
    this.handleUserReply(id, ctx, ctx.update.callback_query.data);
  }

  @On("message")
  async onMessage(ctx: Context) {
    // On payment success
    if (ctx.update.message?.successful_payment) {
      const {
        invoice_payload,
        telegram_payment_charge_id,
        provider_payment_charge_id,
      } = ctx.update.message?.successful_payment;
      await this.subscriptionService.update(invoice_payload, {
        status: SubscriptionStatusEnum.PAID,
        telegram_payment_charge_id,
        provider_payment_charge_id,
      });

      return;
    }
    const { id: telegramId } = ctx.update.message.from;
    const commands = Object.keys(TelegramFlowCommandEnum);
    if (!commands.includes(ctx.message.text)) {
      this.handleUserReply(telegramId, ctx, ctx.message.text);
    } else {
      const user = await this.userService.findOne({ telegramId });
      if (!user)
        throw new BadRequestException({ message: "Пользователь не найден" });
      await this.userService.update(user.id, {
        telegramFlow: TelegramFlowCommandEnum[ctx.message.text],
        telegramState: TelegramFlowStateEnum.DEFAULT,
      });
      this.handleUserReply(telegramId, ctx);
    }
  }

  @On("poll_answer")
  async onPollAnswer(ctx: Context) {
    const { id } = ctx.pollAnswer.user;
    this.handleUserReply(id, ctx);
  }

  @On("pre_checkout_query")
  async onPaymentPreCheckoutQuery(ctx: Context) {
    try {
      // Perform any necessary validation of the pre_checkout_query here
      // For example, verify the total amount and currency
      await ctx.answerPreCheckoutQuery(true);
      console.log("Pre-checkout query successful.");
    } catch (error) {
      console.error("Failed to process pre-checkout query:", error);
      await ctx.answerPreCheckoutQuery(
        false,
        "An error occurred while processing your payment. Please try again."
      );
    }
  }

  async sendRecipeToTelegram() {
    const photoURL = `https://s3.timeweb.com/28cccca7-a4a6083c-5d86-48e1-9443-f3e3a71dacd5/Screenshot 2024-02-17 at 14.34.05.png`;
    const caption = `☕️ Завтрак вс, 18 февр`;
    const reply_markup = {
      inline_keyboard: [
        [
          {
            text: "Открыть рецепт",
            url: `https://telegra.ph/Zavtrak-vs-18-fevr-02-17`, // Link URL
          },
        ],
      ],
    };

    try {
      await this.bot.api.sendPhoto(764201935, photoURL, {
        caption,
        reply_markup,
      });
    } catch (error) {
      console.error("Error sending photo:", error);
    }
  }
}

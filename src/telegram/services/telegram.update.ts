import { Bot, Context, Keyboard } from "grammy";
import { InjectBot, Update, Start, Ctx, On, Help } from "@grammyjs/nestjs";
import { UserService } from "src/user/services/user.service";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { TelegramFlowCommandEnum } from "../enums/telegram-flow-command.enum";
import { TelegramFlowEnum } from "../enums/telegram-flow.enum";
import { TelegramService } from "./telegram.service";

@Update()
export class TelegramUpdate {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly userService: UserService,
    private readonly telegramService: TelegramService
  ) {
    this.bot.catch(this.handleBotError);
  }

  @Start()
  async start(@Ctx() ctx: Context) {
    let { user } = await this.telegramService.getUser(ctx);
    user = await this.userService.update(user.id, {
      telegramFlow: TelegramFlowEnum.START,
      telegramState: TelegramFlowStateEnum.START_INIT,
    });
    const steps = this.telegramService.getFlowSteps(TelegramFlowEnum.START);
    await this.telegramService.sendStepMessage(user, steps[0], ctx);
  }

  @Help()
  async onHelp(ctx: Context) {
    let { telegramUser } = await this.telegramService.getUser(ctx);
    ctx.reply(
      `Привет, ${telegramUser.first_name}. Меня зовут Дмитрий 👨‍💻, я создал данного бота. Если у тебя есть вопросы, тогда пиши мне, я буду рад тебе помочь. Мой телеграм: @gonchardev`
    );
  }

  @On("callback_query")
  async onCallbackQuery(ctx: Context) {
    const { telegramUser, user } = await this.telegramService.getUser(ctx);
    const steps = this.telegramService.getFlowSteps(user.telegramFlow);
    const step = steps.find((el) => el.key === user.telegramState);
    const chosenValue = step.buttons.find(
      (el) => el.value === ctx.update.callback_query.data
    ).label;
    await this.bot.api.editMessageText(
      telegramUser.id,
      ctx.update.callback_query.message.message_id,
      `${ctx.update.callback_query.message.text}\n\n${chosenValue}`
    );

    await this.telegramService.saveAnswer(
      user,
      ctx,
      ctx?.update?.callback_query?.id,
      null,
      ctx?.update?.callback_query?.data
    );
  }

  @On("/recipe")
  async onRecipe(ctx: Context) {
    ctx.reply(
      "😁 Привет! Данная функция ещё в разработке 👨‍💻. Сообщу тебе как будет готова 🫡."
    );
  }

  @On("message")
  async onMessage(ctx: Context) {
    const commands = Object.keys(TelegramFlowCommandEnum);
    if (!commands.includes(ctx.update.message.text)) {
      const { user } = await this.telegramService.getUser(ctx);
      const messageExists = await this.telegramService.editAnswer(
        user,
        ctx,
        ctx?.update?.message?.text,
        ctx?.update?.message?.reply_to_message?.message_id
      );
      if (messageExists) return;

      await this.telegramService.saveAnswer(
        user,
        ctx,
        ctx?.update?.message?.message_id,
        ctx?.update?.message?.reply_to_message?.message_id,
        ctx.update.message.text
      );
    }
  }

  @On("poll_answer")
  async onPollAnswer(ctx: Context) {
    try {
      if (ctx.update?.poll_answer?.option_ids?.length === 0) return;
      const { user } = await this.telegramService.getUser(ctx);

      const messageExists = await this.telegramService.editAnswer(
        user,
        ctx,
        ctx.update?.poll_answer?.option_ids,
        ctx.update?.poll_answer?.poll_id
      );
      if (messageExists) return;

      const steps = this.telegramService.getFlowSteps(user.telegramFlow);
      const index = steps.findIndex((el) => el.key === user.telegramState);

      const value = steps[index].poll?.values.filter((el, key) =>
        ctx.update?.poll_answer?.option_ids?.includes(key)
      );

      await this.telegramService.saveAnswer(
        user,
        ctx,
        ctx.update?.poll_answer?.poll_id,
        null,
        value
      );
    } catch (err) {
      console.log("🚀 ~ TelegramUpdate ~ onPollAnswer ~ err:", err);
      this.handleBotError({ ctx }, ctx.update.poll_answer.user.id);
    }
  }

  @On("edited_message")
  async messageEdit(ctx: Context) {
    const { user } = await this.telegramService.getUser(ctx);
    await this.telegramService.editAnswer(
      user,
      ctx,
      ctx.update.edited_message.text,
      ctx.update.edited_message.message_id
    );
  }

  async handleBotError(error: { ctx: Context }, telegramId?: number) {
    try {
      const emoji = ["😬", "🤯", "😳", "🥺", "😜", "😵", "😵‍💫"];
      const random = Math.ceil(Math.random() * emoji.length) - 1;
      const message = `${emoji[random]} Ой, что-то пошло не так. Попробуй ещё раз.`;
      if (telegramId) {
        error.ctx.api.sendMessage(telegramId, message);
      } else {
        error.ctx.reply(message);
      }
    } catch (err) {
      console.log("🚀 ~ TelegramUpdate ~ handleBotError ~ err:", err);
    }
  }
}

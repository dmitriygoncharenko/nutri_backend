import { InjectBot } from "@grammyjs/nestjs";
import { Injectable } from "@nestjs/common";
import { Bot, Context, InlineKeyboard, InputFile } from "grammy";
import { BotMessageEntity } from "../entities/bot-message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { UserService } from "src/user/services/user.service";
import { TelegramFlowEnum } from "../enums/telegram-flow.enum";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramStartFlowService } from "../flows/telegram-start-flow.service";
import { UserEntity } from "src/user/entities/user.entity";
import { createReadStream } from "fs";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { TelegramRecipeFlowService } from "../flows/telegram-recipe-flow.service";

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    @InjectRepository(BotMessageEntity)
    private readonly botMessageRepository: Repository<BotMessageEntity>,
    private readonly userService: UserService,
    private readonly telegramStartFlowService: TelegramStartFlowService,
    private readonly telegramRecipeFlowService: TelegramRecipeFlowService
  ) {}

  async getUser(ctx: Context) {
    const telegramUser =
      ctx?.update?.message?.from ||
      ctx?.update?.callback_query?.from ||
      ctx?.update?.poll_answer?.user ||
      ctx?.update?.edited_message?.from;
    if (!telegramUser || !telegramUser?.id) throw new Error("User not found");
    if (telegramUser.is_bot) {
      ctx.api.sendMessage(
        telegramUser.id,
        "😜 Извини, брат, я работаю только с живыми людьми"
      );
      throw new Error("User is a bot");
    }

    let user = await this.userService.findOne({
      where: { telegramId: String(telegramUser.id) },
    });
    if (!user) {
      user = await this.userService.create({
        telegramId: String(telegramUser?.id),
        telegramUsername: telegramUser?.username,
        profile: {
          telegramName: `${telegramUser?.first_name} ${telegramUser?.last_name}`,
        },
      });
      await this.bot.api.sendMessage(
        764201935,
        `New user: ${
          telegramUser?.username
            ? "@" + telegramUser?.username
            : telegramUser?.first_name + " " + telegramUser?.last_name
        }`
      );
    }
    return { telegramUser, user };
  }

  async sendMessageWithImage(
    caption: string,
    imageUrl: string,
    button: { text: string; url: string }[],
    telegramId: string
  ) {
    const reply_markup = {
      inline_keyboard: [button],
    };

    try {
      await this.bot.api.sendPhoto(telegramId, imageUrl, {
        caption,
        reply_markup,
      });
    } catch (error) {
      console.error("Error from telegram sendMessageWithImage", error);
    }
  }

  async createBotMessage(
    value: Partial<BotMessageEntity>
  ): Promise<BotMessageEntity> {
    return await this.botMessageRepository.save(
      this.botMessageRepository.create(value)
    );
  }

  async getBotMessage(
    options: FindOneOptions<BotMessageEntity>
  ): Promise<BotMessageEntity> {
    return await this.botMessageRepository.findOne(options);
  }

  getFlowSteps(flow: TelegramFlowEnum): TelegramFlowStepInterface[] {
    const flows = {
      [TelegramFlowEnum.START]: this.telegramStartFlowService.getSteps(),
      [TelegramFlowEnum.RECIPE]: this.telegramRecipeFlowService.getSteps(),
    };
    const steps = flows[flow];
    if (!steps) throw new Error("Шаги для флоу не найдены");
    return steps;
  }

  async sendMessage(id: number, text: string) {
    return await this.bot.api.sendMessage(id, text);
  }

  async sendStepMessage(
    user: UserEntity,
    step: TelegramFlowStepInterface,
    ctx: Context
  ) {
    if (!step.message) return;
    const message = await step.message(user);
    if (!message) return;
    const steps = this.getFlowSteps(user.telegramFlow);
    const stepIndex = steps.findIndex((el) => el.key === step.key);

    if (step?.buttons?.length) {
      await ctx.api.sendMessage(user.telegramId, message, {
        reply_markup: InlineKeyboard.from([
          step.buttons.map((el) => InlineKeyboard.text(el.label, el.value)),
        ]),
      });
    } else if (step?.poll) {
      //@ts-ignore
      await ctx.api.sendPoll(user.telegramId, message, step.poll.values, {
        ...step.poll.options,
        is_anonymous: false,
        protect_content: true,
      });

      // step.key
    } else if (step.file) {
      await ctx.api.sendVideo(
        user.telegramId,
        new InputFile(createReadStream(step.file.url)),
        { caption: message }
      );
    } else {
      await ctx.api.sendMessage(user.telegramId, message, {
        reply_markup: {
          force_reply: stepIndex + 1 !== steps.length ? true : undefined,
        },
      });
    }
  }

  async saveAnswer(
    user: UserEntity,
    ctx: Context,
    messageId: string | number,
    replyMessageId: string | number,
    value: string | string[]
  ) {
    const steps = this.getFlowSteps(user.telegramFlow);
    const index = steps.findIndex((el) => el.key === user.telegramState);
    await steps[index]?.action(user, { [steps[index].field]: value }, ctx);
    if (messageId) {
      await this.createBotMessage({
        messageId: String(messageId),
        userId: user.id,
        stepKey: steps[index].key,
      });
    }
    if (replyMessageId) {
      await this.createBotMessage({
        messageId: String(replyMessageId),
        userId: user.id,
        stepKey: steps[index].key,
      });
    }

    const nextStep = await this.getNextStep(index, steps, user, ctx);
    if (!nextStep) {
      await this.userService.update(user.id, {
        telegramFlow: TelegramFlowEnum.DEFAULT,
        telegramId: TelegramFlowStateEnum.DEFAULT,
      });
    } else {
      await this.sendStepMessage(user, nextStep, ctx);
      await this.userService.update(user.id, {
        telegramState: nextStep.key,
      });
    }
  }

  async editAnswer(
    user: UserEntity,
    ctx: Context,
    value: string | string[] | number[],
    messageId: string | number
  ): Promise<boolean> {
    if (!messageId) return false;
    const message = await this.getBotMessage({
      where: { messageId: String(messageId) },
    });

    if (!message) return false;
    const steps = this.getFlowSteps(user.telegramFlow);
    const step = steps.find((el) => el.key === message.stepKey);
    if (!step) throw new Error("Edit answer: Can't find step");
    let options = {};
    if (step?.poll) {
      const pollValues = value as number[];
      value = step.poll?.values.filter((el, key) => pollValues?.includes(key));
    } else {
      options = {
        reply_to_message_id: messageId,
      };
    }
    await step.action(user, { [step.field]: value }, ctx);
    await this.bot.api.sendMessage(
      user.telegramId,
      "👌 Твой ответ обновлён",
      options
    );
    return true;
  }

  async getNextStep(
    index: number,
    steps: TelegramFlowStepInterface[],
    user: UserEntity,
    ctx: Context
  ) {
    const nextStepIndex = index + 1;
    const nextStep = steps[nextStepIndex];
    if (
      nextStep &&
      nextStep?.skipStep &&
      (await nextStep.skipStep(user, ctx))
    ) {
      return this.getNextStep(nextStepIndex, steps, user, ctx);
    }
    return nextStep;
  }
}

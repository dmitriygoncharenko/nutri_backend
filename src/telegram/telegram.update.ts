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

const validateEmail = (email: string) => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,2,3,4,5,6,7,8,9}]+\.[0-9]{1,2,3,4,5,6,7,8,9}]+\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

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
        await currentStep.action(user.id, {
          [currentStep.field]: value,
        });

        const nextStep = steps[index + 1];
        if (!nextStep)
          throw new BadRequestException({ message: "No more steps" });
        await this.userService.update(user.id, { telegramState: nextStep.key });
        if (nextStep.buttons?.length) {
          await ctx.reply(nextStep.message, {
            reply_markup: InlineKeyboard.from([
              nextStep.buttons.map((el) =>
                InlineKeyboard.text(el.label, el.value)
              ),
            ]),
          });
        } else {
          await ctx.reply(nextStep.message, {
            reply_markup: { remove_keyboard: true },
          });
        }
      }
    } catch (err) {
      console.log(err);
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
      ctx.reply(steps[index].message);
    } catch (err) {
      console.log(err);
    }
  }
  @On("callback_query")
  async onCallbackQuery(ctx: Context) {
    const { id, username, first_name, last_name } =
      ctx.update.callback_query.from;
    this.handleUserReply(id, ctx.update.callback_query.data, ctx);
  }

  @On("message")
  async onMessage(ctx: Context) {
    const { id, username, first_name, last_name } = ctx.update.message.from;
    this.handleUserReply(id, ctx.message.text, ctx);
  }
}

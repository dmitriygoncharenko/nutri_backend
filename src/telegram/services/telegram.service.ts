import { InjectBot } from "@grammyjs/nestjs";
import { Injectable } from "@nestjs/common";
import { Bot, Context } from "grammy";

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>
  ) {}

  async sendMessage(telegramId: number, text: string) {
    await this.bot.api.sendMessage(telegramId, text);
  }

  async sendMessageWithImage(
    caption: string,
    imageUrl: string,
    button: { text: string; url: string }[],
    telegramId: number
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
}

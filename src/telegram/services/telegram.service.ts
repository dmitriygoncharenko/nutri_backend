import { InjectBot } from "@grammyjs/nestjs";
import { Injectable } from "@nestjs/common";
import { Bot, Context } from "grammy";

@Injectable()
export class TelegramService {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>
  ) {}

  createArticle() {
    // const article = await this.bot.api.
  }
}

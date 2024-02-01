import { InjectBot } from '@grammyjs/nestjs';
import { Bot, Context } from 'grammy';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from 'src/user/services/user.service';
import { IsNull, LessThanOrEqual, Not } from 'typeorm';

@Injectable()
export class TelegramCron {
  public get bot(): Bot<Context> {
    return this._bot;
  }
  constructor(
    @InjectBot()
    private readonly _bot: Bot<Context>,
    private readonly userService: UserService,
  ) {}
  private readonly logger = new Logger(TelegramCron.name);

  // @Cron('* * * * *')
  // async handleCron() {
  // this.logger.debug('Start cron');
  // const now = new Date();
  // if (now.getHours() > 21 || now.getHours() < 9) return false;
  // const koronaRate = await this.koronapayService.rate();
  // const garantexRate = await this.garantexService.rate();
  // const spread = (1 - koronaRate / garantexRate) * 100;
  // const time = `${now.getDate()}/${
  //   now.getMonth() + 1
  // }/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
  // const usersToNotify = await this.userService.getAll({
  //   where: {
  //     spread: LessThanOrEqual((spread * 100).toFixed()),
  //     telegramChatId: Not(IsNull()),
  //   },
  // });
  // usersToNotify.forEach((user) =>
  //   this.bot.api.sendMessage(
  //     user.telegramChatId,
  //     `Spread: ${spread.toFixed(2)}%\nKoronaPay - Garantex\nTime: ${time}`,
  //   ),
  // );
  // this.logger.debug(
  //   `KoronaPay - Garantex / ${time} / ${koronaRate} / ${garantexRate} / ${spread} / users: ${usersToNotify.length}`,
  // );
  // }
}

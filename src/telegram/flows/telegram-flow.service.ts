import { BadRequestException, Injectable } from "@nestjs/common";
import { TelegramFlowEnum } from "../enums/telegram-flow.enum";
import { TelegramStartFlowService } from "./telegram-start-flow.service";
import { TelegramFlowCommandEnum } from "../enums/telegram-flow-command.enum";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramRecipeFlowService } from "./telegram-recipe-flow.service";
import { TelegramWeightFlowService } from "./telegram-weight-flow.service";
import { TelegramPayFlowService } from "./telegram-pay-flow.service";

@Injectable()
export class TelegramFlowService {
  constructor(
    private telegramStartFlowService: TelegramStartFlowService,
    private telegramRecipeFlowService: TelegramRecipeFlowService,
    private telegramWeightFlowService: TelegramWeightFlowService,
    private telegramPayFlowService: TelegramPayFlowService
  ) {}

  getFlowSteps(flow: TelegramFlowEnum): TelegramFlowStepInterface[] {
    const flows = {
      [TelegramFlowEnum.START]: this.telegramStartFlowService.getSteps(),
      [TelegramFlowEnum.RECIPE]: this.telegramRecipeFlowService.getSteps(),
      [TelegramFlowEnum.WEIGHT]: this.telegramWeightFlowService.getSteps(),
      [TelegramFlowEnum.PAY]: this.telegramPayFlowService.getSteps(),
    };
    const steps = flows[flow];
    if (!steps)
      throw new BadRequestException({ message: "Шаги для флоу не найдены" });
    return steps;
  }
}

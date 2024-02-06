import { Injectable } from "@nestjs/common";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { UserWeightService } from "src/user/services/user-weight.service";
import { Context } from "grammy";
import { UserService } from "src/user/services/user.service";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class TelegramWeightFlowService {
  constructor(
    private readonly userService: UserService,
    private readonly userWeightService: UserWeightService
  ) {}
  getSteps(): TelegramFlowStepInterface[] {
    return [
      {
        key: TelegramFlowStateEnum.WEIGHT_INIT,
        message: async () => "Укажите текущий вес (КГ), например, 90",
        field: "weight",
        action: async (
          user: UserEntity,
          value: { weight: string },
          ctx: Context
        ) => {
          const weight = parseInt(value.weight);
          const lastWeight = await this.userWeightService.getLastWeight(
            user.id
          );
          await this.userWeightService.create(user.id, { weight });
          const diff = lastWeight.weight - weight;
          if (diff !== 0) {
            ctx.api.sendMessage(
              user.telegramId,
              `Ваш вес ${
                diff > 0 ? "уменьшился 🔻" : "увеличился 🔺"
              } на ${Math.abs(diff)} КГ`
            );
          }
        },
      },
      {
        key: TelegramFlowStateEnum.WEIGHT_BMI,
        message: async () => "",
        action: () => {},
        field: null,
      },
    ];
  }
}

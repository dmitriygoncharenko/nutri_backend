import { TelegramFlowEnum } from "./telegram-flow.enum";

export enum TelegramFlowCommandEnum {
  "/start" = TelegramFlowEnum.START,
  "/recipe" = TelegramFlowEnum.RECIPE,
  "/weight" = TelegramFlowEnum.WEIGHT,
}

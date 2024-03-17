import { Injectable } from "@nestjs/common";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { UserEntity } from "src/user/entities/user.entity";

@Injectable()
export class TelegramRecipeFlowService {
  constructor() {}

  getSteps(): TelegramFlowStepInterface[] {
    return [
      {
        key: TelegramFlowStateEnum.START_INIT,
        message: async () =>
          "😁 Привет! Данная функция ещё в разработке 👨‍💻. Сообщу тебе как будет готова 🫡.",
        field: null,
        action: (user: UserEntity, value: { dish_type: string }) => false,
      },
    ];
    return [
      {
        key: TelegramFlowStateEnum.RECIPE_INIT,
        message: async () =>
          "Nutrinetic может создать рецепт вкусного и полезного блюда на основе ваших предпочтений. Выберите какой тип блюда мы будем готовить?",
        field: "dish_type",
        action: (user: UserEntity, value: { dish_type: string }) => {},
        poll: {
          values: ["Завтрак", "Обед", "Ужин", "Перекус"],
          options: {
            type: "regular",
            allows_multiple_answers: false,
          },
        },
      },
      {
        key: TelegramFlowStateEnum.RECIPE_DIET,
        message: async () => "Придерживаетесь ли вы определённой диеты?",
        field: "diet",
        action: (user: UserEntity, value: { dish_type: string }) => {},
        poll: {
          values: [
            "Vegetarian",
            "Vegan",
            "Pescatarian",
            "Flexitarian/Semi-vegetarian",
            "Lacto-vegetarian",
            "Ovo-vegetarian",
            "Lacto-ovo vegetarian",
            "Plant-based",
            "Paleo",
            "Keto",
          ],
          options: {
            type: "regular",
            allows_multiple_answers: false,
          },
        },
      },
    ];
  }
}

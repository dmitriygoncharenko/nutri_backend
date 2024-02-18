import { BadRequestException, Injectable } from "@nestjs/common";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { UserService } from "src/user/services/user.service";
import { UserEntity } from "src/user/entities/user.entity";
import { UserProfileService } from "src/user/services/user-profile.service";
import { UserGenderEnum } from "src/user/enums/user-gender.enum";
import { UserWeightService } from "src/user/services/user-weight.service";
import { UserHeightService } from "src/user/services/user-height.service";
import { SendGridService } from "@anchan828/nest-sendgrid";
import { randomNumber } from "src/shared/utilities/random.utility";
import { UserEmailCodeService } from "src/user/services/user-code.service";
import { validateEmail } from "src/shared/utilities/email.utility";
import { validateDate } from "src/shared/utilities/date.utility";
import { join } from "path";

import { DietEnum, getDietLabels } from "src/user/enums/diet.enum";
import { Context, InlineKeyboard, InputFile } from "grammy";
import { createReadStream } from "fs";
import { stringToNumber } from "src/shared/utilities/number.utility";
import { getUserActivityLevelLabels } from "src/user/enums/user-activity-level.enum";
import {
  findEnumKeyByValue,
  filterEnumKeysByValue,
} from "src/shared/utilities/enum.utility";
import { getUserGoalLabels } from "src/user/enums/user-goal.enum";
import { TelegramPayFlowService } from "./telegram-pay-flow.service";
import { SubscriptionService } from "src/subscription/services/subscription.service";
import { SubscriptionTypeEnum } from "src/subscription/enums/subscription-type.enum";
import { TelegramFlowEnum } from "../enums/telegram-flow.enum";
import { SubscriptionStatusEnum } from "src/subscription/enums/subscription-status.enum";
import { getMealTypeLabels } from "src/meal/enums/meal-type.enum";
import { OpenAIService } from "src/openai/services/openai.service";
import { calculateMetabolismPrompt } from "src/openai/prompts/metabolism.prompt";
import { getRegionLabels } from "src/user/enums/user-region.enum";
import { calcMetabolism } from "src/user/utilities/profile.utility";

@Injectable()
export class TelegramStartFlowService {
  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    private userWeightService: UserWeightService,
    private userHeightService: UserHeightService,
    private userEmailCodeService: UserEmailCodeService,
    private readonly sendGridService: SendGridService,
    private readonly telegramPayFlowService: TelegramPayFlowService,
    private readonly subscriptionService: SubscriptionService,
    private readonly openAiService: OpenAIService
  ) {}

  getSteps(): TelegramFlowStepInterface[] {
    return [
      {
        key: TelegramFlowStateEnum.START_INIT,
        message: async (user: UserEntity) => {
          const userProfile = await this.userProfileService.findOne({
            id: user.profileId,
          });
          return `Привет ${userProfile?.telegramName}, для того, чтобы начать мне нужно узнать больше информации о тебе. Все расчёты для твоего меню производятся на основе данных, которые ты укажешь. Поэтому важно, чтобы данные были достоверными. Укажи cвой пол:`;
        },
        field: "gender",
        action: async (user: UserEntity, value: { gender: UserGenderEnum }) => {
          const { gender } = value;
          await this.userProfileService.update(user.profileId, { gender });
        },
        buttons: [
          { label: "Мужской", value: UserGenderEnum.MALE },
          { label: "Женский", value: UserGenderEnum.FEMALE },
        ],
      },
      {
        key: TelegramFlowStateEnum.START_DOB,
        message: async () => "Укажи дату своего рождения, например, 31.12.1980",
        field: "dob",
        action: async (user: UserEntity, value: { dob: string }) => {
          const { dob } = value;
          if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dob))
            throw new BadRequestException({ message: "Неверный формат даты" });
          await this.userProfileService.update(user.profileId, { dob });
        },
      },
      {
        key: TelegramFlowStateEnum.START_WEIGHT,
        message: async (user: UserEntity) => {
          return "Укажи свой текущий вес в КГ";
        },
        field: "weight",
        action: async (user: UserEntity, value: { weight: string }) => {
          const weight = stringToNumber(value.weight, 3);
          await this.userProfileService.update(user.profileId, { weight });
        },
      },
      {
        key: TelegramFlowStateEnum.START_HEIGHT,
        message: async () => "Укажи свой рост в СМ",
        field: "height",
        action: async (user: UserEntity, value: { height: string }) => {
          const height = stringToNumber(value.height, 3);
          await this.userProfileService.update(user.profileId, { height });
        },
      },
      {
        key: TelegramFlowStateEnum.START_FOOD_TYPE,
        message: async () => "Выбери тип питания:",
        field: "diet",
        action: async (user: UserEntity, value: { diet: string[] }) => {
          const { diet } = value;
          await this.userProfileService.update(user.profileId, {
            diet: findEnumKeyByValue(getDietLabels(), diet[0]),
          });
        },
        poll: {
          values: Object.values(getDietLabels()),
          options: {
            type: "regular",
            allows_multiple_answers: false,
          },
        },
      },
      {
        key: TelegramFlowStateEnum.START_FOOD_COUNT,
        message: async () => "Сколько раз в день ты хочешь питаться?",
        field: "mealTypes",
        action: async (
          user: UserEntity,
          value: { mealTypes: string[] },
          ctx: Context
        ) => {
          const { mealTypes } = value;

          await this.userProfileService.update(user.profileId, {
            mealTypes: filterEnumKeysByValue(getMealTypeLabels(), mealTypes),
          });
        },
        poll: {
          values: Object.values(getMealTypeLabels()),
          options: {
            type: "regular",
            allows_multiple_answers: true,
          },
        },
      },
      {
        key: TelegramFlowStateEnum.START_FOOD_HABITS,
        message: async (user: UserEntity) => {
          return "Что ты не любишь есть или не можешь из-за аллергии или пищевой неперносимости. Опиши в одном ответном сообщении.";
        },
        field: "food_habits",
        action: async (user: UserEntity, value: { food_habits: string }) => {
          const { food_habits } = value;
          await this.userProfileService.update(user.profileId, {
            food_habits,
          });
        },
      },
      {
        key: TelegramFlowStateEnum.START_LOCATION,
        message: async (user: UserEntity) => {
          return "Выбери место, где проживаешь, чтобы мы адаптировали ингредиенты под данную локацию:";
        },
        field: "location",
        action: async (user: UserEntity, value: { location: string[] }) => {
          const { location } = value;
          await this.userProfileService.update(user.profileId, {
            location: findEnumKeyByValue(getRegionLabels(), location[0]),
          });
        },
        poll: {
          values: Object.values(getRegionLabels()),
          options: {
            allows_multiple_answers: false,
            type: "regular",
          },
        },
      },
      {
        key: TelegramFlowStateEnum.START_ACTIVITY_LEVEL,
        message: async (user: UserEntity) => {
          return "Укажи свой уровень активности:";
        },
        field: "activity_level",
        action: async (
          user: UserEntity,
          value: { activity_level: string[] }
        ) => {
          const { activity_level } = value;

          await this.userProfileService.update(user.profileId, {
            activity_level: findEnumKeyByValue(
              getUserActivityLevelLabels(),
              activity_level[0]
            ),
          });
        },
        poll: {
          values: Object.values(getUserActivityLevelLabels()),
          options: {
            allows_multiple_answers: false,
            type: "regular",
          },
        },
      },
      {
        key: TelegramFlowStateEnum.START_GOAL,
        message: async (user: UserEntity) => {
          return "Какие у тебя цели в работе с Nutrinetic?";
        },
        field: "goal",
        action: async (user: UserEntity, value: { goal: string[] }) => {
          const { goal } = value;

          const profile = await this.userProfileService.findOne({
            id: user.profileId,
          });
          profile.goal = filterEnumKeysByValue(getUserGoalLabels(), goal);
          await this.userProfileService.update(user.profileId, {
            goal: profile.goal,
            metabolism: calcMetabolism(profile) || undefined,
          });
        },
        poll: {
          values: Object.values(getUserGoalLabels()),
          options: { allows_multiple_answers: true, type: "regular" },
        },
      },
      {
        key: TelegramFlowStateEnum.START_EMAIL,
        message: async () =>
          "Последний шаг. Укажи Email адрес, чтобы мы могли создать для тебя аккаунт в системе Nutrinetic.",
        field: "email",
        skipStep: async (user: UserEntity) => {
          return user.email_verified;
        },
        action: async (user: UserEntity, value: { email: string }) => {
          const { email } = value;
          const validEmail = validateEmail(email);
          const code = String(randomNumber(6));
          await this.userEmailCodeService.create({ userId: user.id, code });
          await this.sendGridService.send({
            to: validEmail,
            from: "noreply@hollandandbarrett.com",
            subject: "Verification Code",
            text: code,
          });
        },
      },
      {
        key: TelegramFlowStateEnum.START_EMAIL_CODE,
        message: async () =>
          "Введите код, который мы отправили на ваш Email для верификации",
        field: "code",
        skipStep: async (user: UserEntity) => {
          return user.email_verified;
        },
        action: async (user: UserEntity, value: { code: string }) => {
          const { code } = value;
          const userCodeExists = await this.userEmailCodeService.findOne({
            userId: user.id,
            code,
          });
          if (!userCodeExists)
            throw new BadRequestException({
              message: "Код не найден",
            });
          await this.userService.update(user.id, { email_verified: true });
          await this.userEmailCodeService.softDelete(userCodeExists.id);
        },
      },
      {
        key: TelegramFlowStateEnum.DEFAULT,
        message: async (user: UserEntity) => {
          const userHasFreeSubscription =
            !!(await this.subscriptionService.findOne({
              where: {
                userId: user.id,
                type: SubscriptionTypeEnum.FREE,
              },
            }));
          if (userHasFreeSubscription) {
            await this.userService.update(user.id, {
              telegramFlow: TelegramFlowEnum.PAY,
              telegramState: TelegramFlowStateEnum.DEFAULT,
            });
            return null;
          } else {
            await this.subscriptionService.create({
              userId: user.id,
              type: SubscriptionTypeEnum.FREE,
              status: SubscriptionStatusEnum.PAID,
              generations: 7,
            });
            return "Открыли для тебя пробный период на одну неделю. Уже готовим индивидуальное меню на сегодня. А пока предлагаем посмотреть короткий ролик о том, как Nutrinetic помогает людям быть здоровыми.";
          }
        },
        field: null,
        action: null,
        file: {
          url: join(process.cwd(), "public", "videos/greeting_video.mp4"),
        },
      },
    ];
  }
}
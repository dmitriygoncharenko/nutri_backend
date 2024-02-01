import { BadRequestException, Injectable } from "@nestjs/common";
import { TelegramFlowStepInterface } from "../interfaces/telegram-flow-step.interface";
import { TelegramFlowKeyEnum } from "../enums/telegram-flow-key.enum";
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

const code = randomNumber(6);
console.log("🚀 ~ TelegramOnboardingFlowService ~ code:", code);

@Injectable()
export class TelegramOnboardingFlowService {
  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    private userWeightService: UserWeightService,
    private userHeightService: UserHeightService,
    private userEmailCodeService: UserEmailCodeService,
    private readonly sendGridService: SendGridService
  ) {}

  getSteps(): TelegramFlowStepInterface[] {
    return [
      {
        key: TelegramFlowKeyEnum.START,
        message: "Привет, давайте знакомиться. Как вас зовут?",
        field: "fullname",
        action: async (userId: string, value: { fullname: string }) => {
          const { fullname } = value;
          await this.userProfileService.update(userId, { fullname });
        },
      },
      {
        key: TelegramFlowKeyEnum.GENDER,
        message: "Укажите ваш пол",
        field: "gender",
        action: async (userId: string, value: { gender: UserGenderEnum }) => {
          const { gender } = value;
          await this.userProfileService.update(userId, { gender });
        },
        buttons: [
          { label: "Мужской", value: UserGenderEnum.MALE },
          { label: "Женский", value: UserGenderEnum.FEMALE },
        ],
      },
      {
        key: TelegramFlowKeyEnum.WEIGHT,
        message: "Укажите ваш текущий вес (КГ)",
        field: "weight",
        action: async (userId: string, value: { weight: number }) => {
          const { weight } = value;
          await this.userWeightService.create(userId, { weight });
        },
      },
      {
        key: TelegramFlowKeyEnum.HEIGHT,
        message: "Укажите ваш рост (СМ), например 160",
        field: "height",
        action: async (userId: string, value: { height: number }) => {
          const { height } = value;
          await this.userHeightService.create(userId, { height });
        },
      },
      {
        key: TelegramFlowKeyEnum.EMAIL,
        message:
          "Укажите Email адрес, чтобы мы могли создать для вас аккаунт в системе Nutrinetic.",
        field: "email",
        action: async (userId: string, value: { email: string }) => {
          const { email } = value;
          const validEmail = validateEmail(email);
          const code = String(randomNumber(6));
          await this.userEmailCodeService.create({ userId, code });
          await this.sendGridService.send({
            to: validEmail,
            from: "noreply@hollandandbarrett.com",
            subject: "Verification Code",
            text: code,
          });
        },
      },
      {
        key: TelegramFlowKeyEnum.EMAIL_CODE,
        message:
          "Введите код, который мы отправили на ваш Email для верификации",
        field: "code",
        action: async (userId: string, value: { code: string }) => {
          const { code } = value;
          const userCodeExists = await this.userEmailCodeService.findOne({
            userId,
            code,
          });
          if (!userCodeExists)
            throw new BadRequestException({
              message: "Код не найден",
            });
          await this.userService.update(userId, { email_verified: true });
          await this.userEmailCodeService.softDelete(userCodeExists.id);
        },
      },
      {
        key: TelegramFlowKeyEnum.GOAL,
        message: "Какие ваши главные цели в работе с Nutrinetic?",
        field: "goal",
        action: async (userId: string, value: { goal: string[] }) => {
          console.log(value);
        },
        poll: {
          values: [
            "Убрать лишний вес",
            "Правильный образ жизни",
            "Сбалансировать диету",
            "Снизить биологический возраст",
            "Улучшить кожу",
            "Следить за калориями",
            "Убрать дефициты в организме",
          ],
          options: {
            is_anonymous: false,
            type: "regular",
            allows_multiple_answers: true,
          },
        },
      },
      {
        key: TelegramFlowKeyEnum.GOAL_COMMENT,
        message:
          "Спасибо за ваши ответы. Теперь вы можете начать использование Nutrinetic. Посмотрите краткий видео ролик ниже о функциях нашей системы",
        field: null,
        action: null,
      },
    ];
  }
}

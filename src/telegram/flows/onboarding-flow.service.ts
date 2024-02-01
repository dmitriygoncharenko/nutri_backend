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

const code = randomNumber(6);
console.log("🚀 ~ TelegramOnboardingFlowService ~ code:", code);

@Injectable()
export class TelegramOnboardingFlowService {
  constructor(
    private userService: UserService,
    private userProfileService: UserProfileService,
    private userWeightService: UserWeightService,
    private userHeightService: UserHeightService,
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
          const result = await this.sendGridService.send({
            to: email,
            from: "test@example.com",
            subject: "Verification Code",
            text: randomNumber(6),
            // html: "<strong>and easy to do anywhere, even with Node.js</strong>",
          });
          console.log(
            "🚀 ~ TelegramOnboardingFlowService ~ action: ~ result:",
            result[0].body
          );
        },
      },
    ];
  }
}

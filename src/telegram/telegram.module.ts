import { NestjsGrammyModule } from "@grammyjs/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "src/user/user.module";
import { TelegramCron } from "./telegram.cron";
import { TelegramUpdate } from "./telegram.update";
import { TelegramOnboardingFlowService } from "./flows/onboarding-flow.service";

@Module({
  imports: [
    // MODULES
    UserModule,
    // GRAMMY
    NestjsGrammyModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token:
          configService.get("TELEGRAM_BOT_TOKEN") ||
          "6023947364:AAG6r3pccWTbCKTQWMasE4aT0gaazCUNWx4",
        // , // nutrilab
        // '6177188168:AAEQxK2bsAMRXk0a0TwnWaAudGYdPeyRu2I', //TODO env
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramUpdate, TelegramCron, TelegramOnboardingFlowService],
  exports: [TelegramUpdate, TelegramOnboardingFlowService],
})
export class TelegramModule {}

import { Context } from "grammy";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { UserEntity } from "src/user/entities/user.entity";

export interface TelegramFlowStepInterface {
  key: TelegramFlowStateEnum;
  message: (user: UserEntity) => Promise<string>;
  field: string;
  action: (user: UserEntity, value: Record<string, any>, ctx?: Context) => void;
  skipStep?: (user: UserEntity, ctx?: Context) => Promise<boolean>;
  buttons?: { label: string; value: any }[];
  file?: { url?: string };
  poll?: {
    options: {
      is_anonymous?: boolean;
      type?: "quiz" | "regular";
      correct_option_id?: number;
      is_closed?: boolean;
      allows_multiple_answers?: boolean;
      protect_content?: boolean;
    };
    values: string[];
  };
}

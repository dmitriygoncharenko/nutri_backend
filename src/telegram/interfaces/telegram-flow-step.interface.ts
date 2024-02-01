import { TelegramFlowKeyEnum } from "../enums/telegram-flow-key.enum";

export interface TelegramFlowStepInterface {
  key: TelegramFlowKeyEnum;
  message: string;
  field: string;
  action: (userId: string, value: any) => void;
  buttons?: any[];
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

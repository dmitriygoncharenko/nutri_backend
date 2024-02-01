import { TelegramFlowKeyEnum } from "../enums/telegram-flow-key.enum";

export interface TelegramFlowStepInterface {
  key: TelegramFlowKeyEnum;
  message: string;
  field: string;
  action: (userId: string, value: any) => void;
  buttons?: any[];
}

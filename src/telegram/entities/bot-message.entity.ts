import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TelegramFlowStateEnum } from "../enums/telegram-flow-state.enum";
import { ApiPropertyInt } from "src/shared/decorators/api.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { ApiPropertyId } from "src/shared/decorators/uuid.decorator";
import { UserEntity } from "src/user/entities/user.entity";

@Entity("bot_messages")
export class BotMessageEntity extends AbstractEntity {
  @ApiPropertyInt()
  @Column({ type: "text", unique: true })
  messageId: string;

  @ApiProperty({
    type: () => TelegramFlowStateEnum,
    enum: TelegramFlowStateEnum,
    enumName: "TelegramFlowStateEnum",
    example: TelegramFlowStateEnum.DEFAULT,
  })
  @Column({
    type: "enum",
    enum: TelegramFlowStateEnum,
    enumName: "TelegramFlowStateEnum",
  })
  stepKey: TelegramFlowStateEnum;

  @ApiPropertyId()
  @Column({ type: "uuid" })
  userId: string;

  @ApiProperty({
    type: () => UserEntity,
  })
  @ManyToOne(() => UserEntity, (user) => user.subscriptions)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

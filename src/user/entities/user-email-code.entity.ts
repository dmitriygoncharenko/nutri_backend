import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity("user_email_codes")
export class UserEmailCodeEntity extends AbstractEntity {
  @Column({ type: "text" })
  code: string;

  @Column({ type: "uuid" })
  userId: string;
}
